using Entities.Enums;
using Entities.Helpers;
using System.ComponentModel.DataAnnotations;

namespace Entities.Models
{
    public class ErrorReport : IIdEntity
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        public ErrorCategory Category { get; set; }

        public ErrorPriority Priority { get; set; } = ErrorPriority.Medium;

        public ErrorStatus Status { get; set; } = ErrorStatus.Open;

        public DateTime ReportedDate { get; set; } = DateTime.UtcNow;

        public DateTime? ScheduledRepairDate { get; set; }

        [Required]
        public string ReportedById { get; set; } = string.Empty;
        public AppUser? ReportedBy { get; set; }
    }
}
