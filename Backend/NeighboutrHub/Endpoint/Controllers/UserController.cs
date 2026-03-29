using Data;
using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;

namespace Endpoint.Controllers
{
    [ApiController] 
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        UserManager<AppUser> userManager;
        private readonly IWebHostEnvironment env;
        RoleManager<IdentityRole> roleManager;
        public UserController(UserManager<AppUser> userManager, IWebHostEnvironment env, RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            this.env = env;
            this.roleManager = roleManager;
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
                // Az Identity jelszó szabályai miatt nem sikerül (kell kisbetű/nagybetű/szám)
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ArgumentException("A jelszónak tartalmaznia kell legalább egy számot és egy nagybetűt!");
            }

            if (userManager.Users.Count() == 1)
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
                await userManager.AddToRoleAsync(user, "Admin");
            }

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
    }
}
