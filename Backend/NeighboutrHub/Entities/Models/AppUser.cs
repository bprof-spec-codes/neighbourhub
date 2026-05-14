using Entities.Enums;
using Entities.Helpers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Entities.Models
{
    public class AppUser: IdentityUser, IIdEntity
    {
        public UserRole RequestedRole { get; set; }
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(2048)]
        [Column("ProfileImageUrl")]
        public string? ProfileImagePath { get; set; }

        [StringLength(50)]
        public List<string> Storage { get; set; } = new List<string>();
        [StringLength(50)]
        public List<string> ApartmentNumber { get; set; } = new List<string>();
        [StringLength(50)]
        public List<string> ParkingSpace { get; set; } = new List<string>();
        public bool IsApproved { get; set; } = false;
    }
}