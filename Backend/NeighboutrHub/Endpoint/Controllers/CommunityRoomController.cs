using Entities.Dtos.CommunityRoom;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Endpoint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommunityRoomController : ControllerBase
{
    private readonly CommunityRoomLogic _communityRoomLogic;

    public CommunityRoomController(CommunityRoomLogic communityRoomLogic)
    {
        _communityRoomLogic = communityRoomLogic;
    }

    [HttpGet]
    [Authorize]
    public IEnumerable<CommunityRoomListDto> GetAll()
    {
        return _communityRoomLogic.GetAll();
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IEnumerable<CommunityRoomListDto> GetAllForAdmin()
    {
        return _communityRoomLogic.GetAllForAdmin();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult Add(CommunityRoomCreateDto dto)
    {
        var id = _communityRoomLogic.Add(dto);
        return Ok(new { id });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Update(string id, CommunityRoomUpdateDto dto)
    {
        var success = _communityRoomLogic.Update(id, dto);
        if (!success) return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete(string id)
    {
        var success = _communityRoomLogic.Delete(id);
        if (!success) return NotFound();
        return Ok();
    }
}
