using Entities.Dtos.ErrorReport;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public IEnumerable<ErrorReportListDto> GetAll([FromQuery] string? status, [FromQuery] string? category, [FromQuery] string? priority)
    {
        return _errorReportLogic.GetAll(status, category, priority);
    }

    [HttpPost]
    [Authorize]
    public IActionResult AddErrorReport(ErrorReportCreateDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;

        var id = _errorReportLogic.AddErrorReport(dto, userId);
        return Ok(new { id });
    }

    [HttpGet("summary")]
    [Authorize]
    public object GetSummary()
    {
        return _errorReportLogic.GetSummary();
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(string id)
    {
        var result = _errorReportLogic.GetById(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult Update(string id, ErrorReportUpdateDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;
        var isAdmin = User.IsInRole("Admin");
        var success = _errorReportLogic.Update(id, dto, userId, isAdmin);
        if (!success) return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult Delete(string id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;
        var isAdmin = User.IsInRole("Admin");
        var success = _errorReportLogic.Delete(id, userId, isAdmin);
        if (!success) return NotFound();
        return Ok();
    }
}
