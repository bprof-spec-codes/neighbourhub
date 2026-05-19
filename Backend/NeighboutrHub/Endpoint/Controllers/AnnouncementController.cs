using Entities.Dtos.Announcement;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Endpoint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementController : ControllerBase
{
    private readonly AnnouncementLogic _announcementLogic;

    public AnnouncementController(AnnouncementLogic announcementLogic)
    {
        _announcementLogic = announcementLogic;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public void AddAnnouncement(AnnouncementCreateDto dto)
    {
        _announcementLogic.AddAnnouncement(dto);
    }

    [HttpGet]
    [Authorize]
    public IEnumerable<Announcement> GetAnnouncements()
    {
        return _announcementLogic.GetAnnouncements();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public void DeleteAnnouncementById(string id)
    {
        _announcementLogic.DeleteAnnouncementById(id);
    }

    [HttpGet("carousel")]
    [Authorize]
    public IEnumerable<Announcement> GetCarouselAnnouncements()
    {
        return _announcementLogic.GetCarouselAnnouncements();
    }
}