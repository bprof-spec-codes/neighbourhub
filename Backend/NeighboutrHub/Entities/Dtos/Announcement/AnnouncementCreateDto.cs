using Entities.Helpers;

namespace Entities.Dtos.Announcement;

public class AnnouncementCreateDto
{
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public AnnouncementCategory Category { get; set; }
}