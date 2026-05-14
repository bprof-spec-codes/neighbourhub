using System.ComponentModel.DataAnnotations;

namespace Entities.Dtos.ErrorReportComment
{
    public class ErrorReportCommentCreateDto
    {
        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;
    }
}
