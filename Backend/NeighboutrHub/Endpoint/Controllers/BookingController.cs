using Entities.Dtos.Booking;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Endpoint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly BookingLogic _bookingLogic;

    public BookingController(BookingLogic bookingLogic)
    {
        _bookingLogic = bookingLogic;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IEnumerable<BookingListDto> GetAll()
    {
        return _bookingLogic.GetAll();
    }

    [HttpGet("my")]
    [Authorize]
    public IActionResult GetMy()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;
        return Ok(new
        {
            upcoming = _bookingLogic.GetUpcoming(userId),
            past = _bookingLogic.GetPast(userId)
        });
    }

    [HttpPost]
    [Authorize]
    public IActionResult Create(BookingCreateDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;
        var (success, error) = _bookingLogic.Create(dto, userId);
        if (!success) return BadRequest(new { error });
        return Ok();
    }

    [HttpPut("{id}/cancel")]
    [Authorize]
    public IActionResult Cancel(string id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;
        var isAdmin = User.IsInRole("Admin");
        var success = _bookingLogic.Cancel(id, userId, isAdmin);
        if (!success) return NotFound();
        return Ok();
    }
}
