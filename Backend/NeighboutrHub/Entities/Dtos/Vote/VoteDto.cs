using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Vote
{
    public class VoteDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public bool IsActive { get; set; }
        public int YesCount { get; set; }
        public int NoCount { get; set; }
        public int AbstainCount { get; set; }
        public bool HasVoted { get; set; }
        public string CreatedByUserId { get; set; } = string.Empty;
    }
}
