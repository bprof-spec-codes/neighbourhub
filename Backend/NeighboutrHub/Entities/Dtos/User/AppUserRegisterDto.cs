using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities.Enums;

namespace Entities.Dtos.User
{
    public class AppUserRegisterDto
    {
        
        public required UserRole Role { get; set; }
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Password { get; set; }
        public required List<string> ApartmentNumber { get; set; }
        public required string PhoneNumber { get; set; }
    }
}
