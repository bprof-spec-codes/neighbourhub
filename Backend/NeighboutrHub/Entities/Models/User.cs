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
    public class User: IdentityUser, IIdEntity
    {
        public User()
        {
            Id = Guid.NewGuid().ToString();
        }
        [Key]
        [StringLength(50)]
        public string Id { get; set; } = string.Empty;
        public FileContent Image { get; set; } = null!;
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        [StringLength(50)]
        public string storage { get; set; } = string.Empty;
        [StringLength(50)]
        public string apartmentnumber { get; set; } = string.Empty;
        [StringLength(50)]
        public string parkingspace { get; set; } = string.Empty;


    }
}