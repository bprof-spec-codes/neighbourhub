using Entities.Enums;
using Entities.Helpers;
using System.ComponentModel.DataAnnotations;

namespace Entities.Models
{
    public class Booking : IIdEntity
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string CommunityRoomId { get; set; } = string.Empty;
        public CommunityRoom? CommunityRoom { get; set; }

        [Required]
        public string BookedById { get; set; } = string.Empty;
        public AppUser? BookedBy { get; set; }

        public DateTime BookingDate { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public BookingStatus Status { get; set; } = BookingStatus.Active;

        public int NumberOfPeople { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
