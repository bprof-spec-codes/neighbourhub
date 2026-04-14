using Data;
using Entities.Dtos.User;
using Entities.Enums;
using Entities.Helpers;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        UserManager<AppUser> userManager;
        RoleManager<IdentityRole> roleManager;
        private readonly JwtSettings jwtSettings;
        public UserController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IOptions<JwtSettings> jwtSettings)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.jwtSettings = jwtSettings.Value;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser(AppUserRegisterDto dto)
        {
            if (dto.Password.Length < 8)
                return BadRequest(new { message = "Your password must be at least 8 characters long!" });

            if (await userManager.FindByEmailAsync(dto.Email) != null)
                return BadRequest(new { message = "That email address already exists!" });

            if (!(IsValidEmail(dto.Email)))
                return BadRequest(new { message = "The email address format is incorrect!" });

            if (!(IsValidPhoneNumber(dto.PhoneNumber)))
                return BadRequest(new { message = "The phone number format is incorrect!" });

            

            var user = new AppUser()
            {
                
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                UserName = dto.Email.Split('@')[0],
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                // ITT MÁSOLJUK ÁT A LISTÁKAT:
                ApartmentNumber = dto.ApartmentNumber ?? new List<string>(),
                IsApproved = false,
                RequestedRole = dto.Role
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (result.Succeeded)
            {
                // 1. Megnézzük, hogy az adott Role létezik-e az adatbázisban, ha nem, létrehozzuk
                string roleName = dto.Role.ToString();
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }

                if (userManager.Users.Count() == 1)
                {
                    if (!await roleManager.RoleExistsAsync("Admin"))
                    {
                        await roleManager.CreateAsync(new IdentityRole("Admin"));
                    }
                    await userManager.AddToRoleAsync(user, "Admin");

                    user.IsApproved = true;
                    await userManager.UpdateAsync(user);
                }
                else
                {
                    await userManager.AddToRoleAsync(user, roleName);
                }

                return Ok();
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(AppUserLoginDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Incorrect Email" });
            }

            var result = await userManager.CheckPasswordAsync(user, dto.Password);
            if (!result)
            {
                return BadRequest(new { message = "Incorrect Password" });
            }

            if (!user.IsApproved)
            {
                return Unauthorized(new { message = "Your registration is pending admin approval." });
            }

            var claims = new List<Claim>();
            // A Program.cs-ben NameClaimType = "unique_name" van beállítva:
            claims.Add(new Claim("unique_name", user.UserName!));
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));

            // A Program.cs-ben RoleClaimType = "role" van beállítva:
            var roles = await userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim("role", role));
            }

            int expiryInMinutes = 2400 * 60;
            var token = GenerateAccessToken(claims, expiryInMinutes);

            return Ok(new LoginResultDto()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = DateTime.Now.AddMinutes(expiryInMinutes)
            });
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("PendingUsers")]
        public IActionResult GetPendingUsers()
        {
            var pendingUsers = userManager.Users
                .Where(u => u.IsApproved!=true)
                .Select(u => new PendingAppUserDto
                {
                    Id = u.Id,
                    FullName = $"{u.FirstName} {u.LastName}",
                    Email = u.Email!,
                    ApartmentNumber = u.ApartmentNumber,
                    Role = u.RequestedRole
                }).ToList();

            return Ok(pendingUsers);
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("ApproveUser")]
        public async Task<IActionResult> ApproveUser(ApproveAppUserDto dto)
        {
            var user = await userManager.FindByIdAsync(dto.UserId);
            if (user == null) return NotFound("User not found");

            string finalRole = !string.IsNullOrEmpty(dto.Role.ToString())
                               ? dto.Role.ToString()
                               : user.RequestedRole.ToString();


            user.IsApproved = true;


            if (Enum.TryParse<UserRole>(finalRole, out var parsedRole))
            {
                user.RequestedRole = parsedRole;
            }

            var updateResult = await userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return BadRequest("Failed to update user status");


            if (!await roleManager.RoleExistsAsync(finalRole))
            {
                await roleManager.CreateAsync(new IdentityRole(finalRole));
            }

            // Biztonság kedvéért töröljük az esetleges régi szerepköreit, hogy ne legyen egyszerre Tenant és Owner is véletlenül
            var currentRoles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, currentRoles);

            var roleResult = await userManager.AddToRoleAsync(user, finalRole);
            if (!roleResult.Succeeded) return BadRequest("Failed to add user to role");

            return Ok(new { message = $"User approved as {finalRole}" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("RejectUser/{userId}")]
        public async Task<IActionResult> RejectUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            // Ha már jóvá van hagyva, ne lehessen véletlenül törölni ezen a felületen
            if (user.IsApproved)
                return BadRequest("Cannot reject an already approved user.");

            var result = await userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "Registration rejected and user deleted successfully." });
            }

            return BadRequest("Failed to delete user during rejection.");
        }
        private bool IsValidEmail(string email)
        {
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
        }
        private bool IsValidPhoneNumber(string phoneNumber)
        {
            // +36301234567, 06201234567, +36-70-123-4567
            string pattern = @"^(\+36|06|36)?[\s\-]?(20|30|31|70|1|[2-9][0-9])[\s\-]?[0-9]{3}[\s\-]?[0-9]{3,4}$";

            if (string.IsNullOrWhiteSpace(phoneNumber))
                return false;

            return Regex.IsMatch(phoneNumber, pattern, RegexOptions.IgnoreCase);
        }
        private JwtSecurityToken GenerateAccessToken(IEnumerable<Claim>? claims, int expiryInMinutes)
        {
            var signinKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key));

            return new JwtSecurityToken(
                issuer: jwtSettings.Issuer,
                audience: jwtSettings.Issuer,
                claims: claims,
                expires: DateTime.Now.AddMinutes(expiryInMinutes),
                signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
            );
        }
    }
}