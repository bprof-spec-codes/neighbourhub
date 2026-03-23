namespace Entities.Dtos.ErrorReport
{
    public class ErrorReportDetailDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime ReportedDate { get; set; }
        public DateTime? ScheduledRepairDate { get; set; }
        public string ReportedById { get; set; } = string.Empty;
        public string ReportedByName { get; set; } = string.Empty;
    }
}
