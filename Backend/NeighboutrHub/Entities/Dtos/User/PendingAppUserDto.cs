using Entities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.User
{
    public class PendingAppUserDto
    {
        public required string Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required List<string> ApartmentNumbers { get; set; }
        public required UserRole Role { get; set; }
    }
}