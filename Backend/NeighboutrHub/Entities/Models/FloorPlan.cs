using Entities.Helpers;

namespace Entities.Models;

public class FloorPlan : IIdEntity
{
    public string Id { get; set; }
    public int Floor { get; set; }
    public string ImageUrl { get; set; }
    public List<PinPoint> PinPoints { get; set; }

    public FloorPlan()
    {
        Id = Guid.NewGuid().ToString();
    }
}