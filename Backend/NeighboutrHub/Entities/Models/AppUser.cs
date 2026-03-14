using Entities.Helpers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Entities.Models
{
    public class AppUser: IdentityUser, IIdEntity
    {
        public AppUser()
        {
        }
        
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        [StringLength(50)]
        public List<string> Storage { get; set; } = new List<string>();
        [StringLength(50)]
        public List<string> ApartmentNumber { get; set; } = new List<string>();
        [StringLength(50)]
        public List<string> ParkingSpace { get; set; } = new List<string>();


    }
}