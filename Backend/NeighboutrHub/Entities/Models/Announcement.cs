using System.ComponentModel.DataAnnotations;
using Entities.Helpers;

namespace Entities.Models;

public class Announcement : IIdEntity
{
    [StringLength(50)]
    public string Id { get; set; }
    [StringLength(50)]
    public string Title { get; set; }
    [StringLength(5000)]
    public string Content { get; set; }
    public AnnouncementCategory Category { get; set; }
    public DateTime CreatedDate { get; set; }

    public Announcement()
    {
        Id = Guid.NewGuid().ToString();
        CreatedDate = DateTime.Now;
    }
}