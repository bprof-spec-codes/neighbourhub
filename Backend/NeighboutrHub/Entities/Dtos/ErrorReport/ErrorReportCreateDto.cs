namespace Entities.Dtos.ErrorReport
{
    public class ErrorReportCreateDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Category { get; set; }
    }
}
