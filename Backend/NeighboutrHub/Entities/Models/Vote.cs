using Entities.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Vote : IIdEntity
    {
        public Vote()
        {
            Id = Guid.NewGuid().ToString();
        }

        [Key]
        [StringLength(50)]
        public string Id { get; set; }

        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        public DateTime Deadline { get; set; }

        [StringLength(50)]
        public string CreatedByUserId { get; set; } = string.Empty;

        //public User CreatedByUser { get; set; } = null!;

     
    }
}

