using Entities.Dtos.Announcement;
using Logic.Logic;
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
    public void AddAnnouncement(AnnouncementCreateDto dto)
    {
        _announcementLogic.AddAnnouncement(dto);
    }
}