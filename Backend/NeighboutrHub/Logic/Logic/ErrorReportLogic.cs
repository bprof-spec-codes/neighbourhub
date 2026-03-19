using Data;
using Entities.Dtos.ErrorReport;
using Entities.Enums;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Logic.Logic;

public class ErrorReportLogic
{
    private readonly Repository<ErrorReport> repository;

    public ErrorReportLogic(Repository<ErrorReport> repository)
    {
        this.repository = repository;
    }

    public IEnumerable<ErrorReportListDto> GetAll(string? status, string? category, string? priority)
    {
        var query = repository.GetAll().AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<ErrorStatus>(status, true, out var s))
            query = query.Where(e => e.Status == s);

        if (!string.IsNullOrEmpty(category) && Enum.TryParse<ErrorCategory>(category, true, out var c))
            query = query.Where(e => e.Category == c);

        if (!string.IsNullOrEmpty(priority) && Enum.TryParse<ErrorPriority>(priority, true, out var p))
            query = query.Where(e => e.Priority == p);

        return query
            .OrderByDescending(e => e.ReportedDate)
            .Select(e => new ErrorReportListDto
            {
                Id = e.Id,
                Title = e.Title,
                Category = e.Category.ToString(),
                Priority = e.Priority.ToString(),
                Status = e.Status.ToString(),
                ScheduledRepairDate = e.ScheduledRepairDate
            })
            .ToList();
    }

    public object GetSummary()
    {
        var all = repository.GetAll();
        return new
        {
            Total = all.Count(),
            Open = all.Count(e => e.Status == ErrorStatus.Open),
            InProgress = all.Count(e => e.Status == ErrorStatus.InProgress),
            Resolved = all.Count(e => e.Status == ErrorStatus.Resolved)
        };
    }
}
