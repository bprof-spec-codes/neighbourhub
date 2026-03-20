using Entities.Dtos.ErrorReport;
using Logic.Logic;
using Microsoft.AspNetCore.Mvc;

namespace Endpoint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ErrorReportController : ControllerBase
{
    private readonly ErrorReportLogic _errorReportLogic;

    public ErrorReportController(ErrorReportLogic errorReportLogic)
    {
        _errorReportLogic = errorReportLogic;
    }

    [HttpGet]
    public IEnumerable<ErrorReportListDto> GetAll([FromQuery] string? status, [FromQuery] string? category, [FromQuery] string? priority)
    {
        return _errorReportLogic.GetAll(status, category, priority);
    }

    [HttpGet("summary")]
    public object GetSummary()
    {
        return _errorReportLogic.GetSummary();
    }
}
