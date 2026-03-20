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

    [HttpPost]
    public IActionResult AddErrorReport(ErrorReportCreateDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var id = _errorReportLogic.AddErrorReport(dto, userId);
        return Ok(new { id });
    }

    [HttpGet("summary")]
    public object GetSummary()
    {
        return _errorReportLogic.GetSummary();
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var result = _errorReportLogic.GetById(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, ErrorReportUpdateDto dto)
    {
        var success = _errorReportLogic.Update(id, dto);
        if (!success) return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var success = _errorReportLogic.Delete(id);
        if (!success) return NotFound();
        return Ok();
    }
}
