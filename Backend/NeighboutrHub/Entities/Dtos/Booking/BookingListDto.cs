namespace Entities.Dtos.Booking
{
    public class BookingListDto
    {
        public string Id { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public string BookedByName { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int NumberOfPeople { get; set; }
    }
}
