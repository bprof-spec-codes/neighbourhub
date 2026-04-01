using Data;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
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
                ApartmentNumber = dto.ApartmentNumber ?? new List<string>()
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { message = "Your password must contain at least one number and one uppercase letter!" });
            }

            if (userManager.Users.Count() == 1)
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
                await userManager.AddToRoleAsync(user, "Admin");
            }

            return Ok();
        }

        [HttpPost("login")]
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

            var claim = new List<Claim>();
            claim.Add(new Claim(ClaimTypes.Name, user.UserName!));
            claim.Add(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));

            foreach (var role in await userManager.GetRolesAsync(user))
            {
                claim.Add(new Claim(ClaimTypes.Role, role));
            }

            int expiryInMinutes = 2400 * 60;
            var token = GenerateAccessToken(claim, expiryInMinutes);

            return Ok(new LoginResultDto()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = DateTime.Now.AddMinutes(expiryInMinutes)
            });
        }

        [HttpGet("CountUsers")]
        public IActionResult CountUsers()
        {
            var count = userManager.Users.Count();
            return Ok($"A rendszer szerint ennyi user van az adatbázisban: {count}");
        }

        [HttpGet("Residents")]
        public IActionResult GetResidents()
        {
            var residents = userManager.Users
                .Select(u => new ResidentListItemDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email ?? string.Empty,
                    PhoneNumber = u.PhoneNumber ?? string.Empty,
                    ProfileImageUrl = u.ProfileImageUrl,
                    ApartmentNumber = u.ApartmentNumber ?? new List<string>(),
                    ParkingSpace = u.ParkingSpace ?? new List<string>(),
                    Storage = u.Storage ?? new List<string>()
                })
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .ToList();

            return Ok(residents);
        }

        [HttpGet("Residents/{id}")]
        public async Task<IActionResult> GetResidentById(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return NotFound("A felhasználó nem található.");

            var resident = new ResidentListItemDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                ProfileImageUrl = user.ProfileImageUrl,
                ApartmentNumber = user.ApartmentNumber ?? new List<string>(),
                ParkingSpace = user.ParkingSpace ?? new List<string>(),
                Storage = user.Storage ?? new List<string>()
            };

            return Ok(resident);
        }

        [HttpPut("Residents/{id}")]
        public async Task<IActionResult> UpdateResident(string id, AdminUpdateResidentDto dto)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return NotFound("A felhasználó nem található.");

            if (!IsValidEmail(dto.Email)) return BadRequest("Az email cím formátuma nem megfelelő!");
            if (!IsValidPhoneNumber(dto.PhoneNumber)) return BadRequest("A telefonszám formátuma nem megfelelő!");

            var existingUserWithEmail = await userManager.FindByEmailAsync(dto.Email);
            if (existingUserWithEmail != null && existingUserWithEmail.Id != user.Id)
            {
                return BadRequest("Az email cím már foglalt.");
            }

            var apartmentNumbers = NormalizeCodes(dto.ApartmentNumber);
            var parkingSpaces = NormalizeCodes(dto.ParkingSpace);
            var storages = NormalizeCodes(dto.Storage);

            var otherUsers = userManager.Users.Where(u => u.Id != user.Id).ToList();

            var apartmentConflict = otherUsers
                .SelectMany(u => u.ApartmentNumber ?? new List<string>())
                .Select(NormalizeCode)
                .FirstOrDefault(code => apartmentNumbers.Contains(code));

            if (!string.IsNullOrEmpty(apartmentConflict))
            {
                return BadRequest($"A lakás már másik lakóhoz van rendelve: {apartmentConflict}");
            }

            var parkingConflict = otherUsers
                .SelectMany(u => u.ParkingSpace ?? new List<string>())
                .Select(NormalizeCode)
                .FirstOrDefault(code => parkingSpaces.Contains(code));

            if (!string.IsNullOrEmpty(parkingConflict))
            {
                return BadRequest($"A parkolóhely már másik lakóhoz van rendelve: {parkingConflict}");
            }

            var storageConflict = otherUsers
                .SelectMany(u => u.Storage ?? new List<string>())
                .Select(NormalizeCode)
                .FirstOrDefault(code => storages.Contains(code));

            if (!string.IsNullOrEmpty(storageConflict))
            {
                return BadRequest($"A tároló már másik lakóhoz van rendelve: {storageConflict}");
            }

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.UserName = dto.Email.Split('@')[0];
            user.PhoneNumber = dto.PhoneNumber;
            user.ProfileImageUrl = string.IsNullOrWhiteSpace(dto.ProfileImageUrl) ? null : dto.ProfileImageUrl.Trim();
            user.ApartmentNumber = apartmentNumbers;
            user.ParkingSpace = parkingSpaces;
            user.Storage = storages;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(errors);
            }

            return Ok();
        }

        private static List<string> NormalizeCodes(List<string>? codes)
        {
            return (codes ?? new List<string>())
                .Select(NormalizeCode)
                .Where(code => !string.IsNullOrWhiteSpace(code))
                .Distinct()
                .ToList();
        }

        private static string NormalizeCode(string? code)
        {
            return (code ?? string.Empty).Trim().ToUpperInvariant();
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
                claims: claims?.ToArray(),
                expires: DateTime.Now.AddMinutes(expiryInMinutes),
                signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
            );
        }
    }
}
