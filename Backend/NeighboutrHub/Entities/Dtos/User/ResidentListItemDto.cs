using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.User
{
    public class ResidentListItemDto
    {
        public required string Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public string? ProfileImageUrl { get; set; }
        public required List<string> ApartmentNumber { get; set; }
        public required List<string> ParkingSpace { get; set; }
        public required List<string> Storage { get; set; }
    }
}
