using Data;
using Entities.Dtos.ErrorReportComment;
using Entities.Models;
using Logic.Helper;
using Microsoft.EntityFrameworkCore;

namespace Logic.Logic;

public class ErrorReportCommentLogic
{
    private readonly Repository<ErrorReportComment> _repository;
    private readonly DtoProvider _dtoProvider;

    public ErrorReportCommentLogic(Repository<ErrorReportComment> repository, DtoProvider dtoProvider)
    {
        _repository = repository;
        _dtoProvider = dtoProvider;
    }

    public IEnumerable<ErrorReportCommentListDto> GetByErrorReport(string errorReportId)
    {
        var list = _repository.GetAll()
            .Include(c => c.Author)
            .Where(c => c.ErrorReportId == errorReportId)
            .OrderByDescending(c => c.CreatedAt)
            .ToList();

        return _dtoProvider.Mapper.Map<List<ErrorReportCommentListDto>>(list);
    }

    public void Add(string errorReportId, string content, string userId)
    {
        var comment = new ErrorReportComment
        {
            ErrorReportId = errorReportId,
            AuthorId = userId,
            Content = content
        };
        _repository.Add(comment);
    }

    public bool Delete(string commentId, string userId, bool isAdmin)
    {
        var comment = _repository.GetAll().FirstOrDefault(c => c.Id == commentId);
        if (comment == null) return false;
        if (!isAdmin && comment.AuthorId != userId) return false;

        _repository.Delete(comment);
        return true;
    }
}
