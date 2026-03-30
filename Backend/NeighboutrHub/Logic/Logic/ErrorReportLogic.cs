using Data;
using Entities.Dtos.ErrorReport;
using Entities.Enums;
using Entities.Models;
using Logic.Helper;
using Microsoft.EntityFrameworkCore;

namespace Logic.Logic;

public class ErrorReportLogic
{
    private readonly Repository<ErrorReport> _repository;
    private readonly DtoProvider _dtoProvider;

    public ErrorReportLogic(Repository<ErrorReport> repository, DtoProvider dtoProvider)
    {
        _repository = repository;
        _dtoProvider = dtoProvider;
    }

    public IEnumerable<ErrorReportListDto> GetAll(string? status, string? category, string? priority)
    {
        var query = _repository.GetAll().AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<ErrorStatus>(status, true, out var s))
            query = query.Where(e => e.Status == s);

        if (!string.IsNullOrEmpty(category) && Enum.TryParse<ErrorCategory>(category, true, out var c))
            query = query.Where(e => e.Category == c);

        if (!string.IsNullOrEmpty(priority) && Enum.TryParse<ErrorPriority>(priority, true, out var p))
            query = query.Where(e => e.Priority == p);

        var list = query.OrderByDescending(e => e.ReportedDate).ToList();
        return _dtoProvider.Mapper.Map<List<ErrorReportListDto>>(list);
    }

    public string AddErrorReport(ErrorReportCreateDto dto, string userId)
    {
        var errorReport = _dtoProvider.Mapper.Map<ErrorReport>(dto);
        errorReport.ReportedById = userId;
        _repository.Add(errorReport);
        return errorReport.Id;
    }

    public ErrorReportDetailDto? GetById(string id)
    {
        var entity = _repository.GetAll()
            .Include(e => e.ReportedBy)
            .FirstOrDefault(e => e.Id == id);

        if (entity == null) return null;

        return _dtoProvider.Mapper.Map<ErrorReportDetailDto>(entity);
    }

    public bool Update(string id, ErrorReportUpdateDto dto, string userId, bool isAdmin)
    {
        var entity = _repository.GetAll().FirstOrDefault(e => e.Id == id);
        if (entity == null) return false;
        if (entity.ReportedById != userId && !isAdmin) return false;

        entity.Title = dto.Title;
        entity.Description = dto.Description;

        if (Enum.TryParse<ErrorCategory>(dto.Category, true, out var c))
            entity.Category = c;

        if (Enum.TryParse<ErrorPriority>(dto.Priority, true, out var p))
            entity.Priority = p;

        if (Enum.TryParse<ErrorStatus>(dto.Status, true, out var s))
            entity.Status = s;

        entity.ScheduledRepairDate = dto.ScheduledRepairDate;

        _repository.Update(entity);
        return true;
    }

    public bool Delete(string id, string userId, bool isAdmin)
    {
        var entity = _repository.GetAll().FirstOrDefault(e => e.Id == id);
        if (entity == null) return false;
        if (entity.ReportedById != userId && !isAdmin) return false;

        _repository.Delete(entity);
        return true;
    }

    public object GetSummary()
    {
        var all = _repository.GetAll();
        return new
        {
            Total = all.Count(),
            Open = all.Count(e => e.Status == ErrorStatus.Open),
            InProgress = all.Count(e => e.Status == ErrorStatus.InProgress),
            Resolved = all.Count(e => e.Status == ErrorStatus.Resolved)
        };
    }
}
