namespace Entities.Dtos.Booking
{
    public class BookingCreateDto
    {
        public required string CommunityRoomId { get; set; }
        public DateTime BookingDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int NumberOfPeople { get; set; }
    }
}
