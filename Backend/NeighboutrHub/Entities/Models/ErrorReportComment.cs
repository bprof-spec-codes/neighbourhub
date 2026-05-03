using System.ComponentModel.DataAnnotations;

namespace Entities.Models
{
    public class ErrorReportComment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string ErrorReportId { get; set; } = string.Empty;
        public ErrorReport? ErrorReport { get; set; }

        [Required]
        public string AuthorId { get; set; } = string.Empty;
        public AppUser? Author { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
