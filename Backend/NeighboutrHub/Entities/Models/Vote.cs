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

       
        public DateTime Deadline { get; set; }

        [StringLength(450)]
        public string CreatedByUserId { get; set; } = string.Empty;

        public AppUser CreatedByUser { get; set; } = null!;

        public ICollection<VoteEntry> Entries { get; set; } = new List<VoteEntry>();

        public bool IsActive => Deadline > DateTime.Now;
    }
}

