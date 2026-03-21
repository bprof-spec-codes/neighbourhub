namespace Entities.Dtos.ErrorReport
{
    public class ErrorReportUpdateDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Category { get; set; }
        public required string Priority { get; set; }
        public required string Status { get; set; }
        public DateTime? ScheduledRepairDate { get; set; }
    }
}
