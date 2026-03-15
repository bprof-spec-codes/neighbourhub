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

            

            var user = new AppUser();
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.UserName = dto.Email.Split('@')[0];
            user.Email = dto.Email;

            

            var result = await userManager.CreateAsync(user, dto.Password);

            if (userManager.Users.Count() == 1)
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
                await userManager.AddToRoleAsync(user, "Admin");
            }

        }

        
    }
}
