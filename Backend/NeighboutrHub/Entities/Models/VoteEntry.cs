using Entities.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public enum VoteOption { Yes, No, Abstain }
    public class VoteEntry : IIdEntity
    {
        public VoteEntry()
        {
            Id = Guid.NewGuid().ToString();
        }

        [Key]
        [StringLength(50)]
        public string Id { get; set; }

        [StringLength(50)]
        public string VoteId { get; set; } = string.Empty;

        public Vote Vote { get; set; } = null!;

        [StringLength(450)]
        public string UserId { get; set; } = string.Empty;

        public AppUser User { get; set; } = null!;

        public VoteOption Option { get; set; }

        
    }
}

