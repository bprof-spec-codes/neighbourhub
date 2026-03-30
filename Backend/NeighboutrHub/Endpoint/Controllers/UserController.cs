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
        public async Task RegisterUser(AppUserRegisterDto dto)
        {
            if (dto.Password.Length < 8) throw new ArgumentException("A jelszónak legalább 8 karakter hosszúnak kell lennie!");

            if (await userManager.FindByEmailAsync(dto.Email) != null) throw new ArgumentException("Az emalcím már létezik!");

            if (!(IsValidEmail(dto.Email))) throw new ArgumentException("Az email cím formátuma nem megfelelő!");
            if (!(IsValidPhoneNumber(dto.PhoneNumber))) throw new ArgumentException("A telefonszám formátuma nem megfelelő!");

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
                throw new ArgumentException("A jelszónak tartalmaznia kell legalább egy számot és egy nagybetűt!");
            }

            if (userManager.Users.Count() == 1)
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
                await userManager.AddToRoleAsync(user, "Admin");
            }

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
