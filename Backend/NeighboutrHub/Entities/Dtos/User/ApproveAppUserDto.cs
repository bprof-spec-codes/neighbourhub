using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.User
{
    public class ApproveAppUserDto
    {
        public required string UserId { get; set; }
        public required string Role { get; set; } // Pl: "OwnerResiding", "Tenant", "Owner"
    }
}