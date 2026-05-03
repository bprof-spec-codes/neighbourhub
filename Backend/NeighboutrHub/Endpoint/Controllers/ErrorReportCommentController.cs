using Entities.Dtos.ErrorReportComment;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Endpoint.Controllers;

[ApiController]
[Route("api/ErrorReport/{errorReportId}/comments")]
public class ErrorReportCommentController : ControllerBase
{
    private readonly ErrorReportCommentLogic _commentLogic;

    public ErrorReportCommentController(ErrorReportCommentLogic commentLogic)
    {
        _commentLogic = commentLogic;
    }

    [HttpGet]
    [Authorize]
    public IEnumerable<ErrorReportCommentListDto> GetAll(string errorReportId)
    {
        return _commentLogic.GetByErrorReport(errorReportId);
    }

    [HttpPost]
    [Authorize]
    public IActionResult Add(string errorReportId, ErrorReportCommentCreateDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;
        _commentLogic.Add(errorReportId, dto.Content, userId);
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult Delete(string errorReportId, string id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;
        var isAdmin = User.IsInRole("Admin");
        var success = _commentLogic.Delete(id, userId, isAdmin);
        if (!success) return NotFound();
        return Ok();
    }
}
