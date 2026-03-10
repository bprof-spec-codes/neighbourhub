using Entities.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class User:IIdEntity
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
        public string PhoneNumber { get; set; } = string.Empty;
        [StringLength(50)]
        public string Storage { get; set; } = string.Empty;
        [StringLength(50)]
        public string apartmentNumber { get; set; } = string.Empty;
        [StringLength(50)]
        public string parkingSpace { get; set; } = string.Empty;

        
    }
}