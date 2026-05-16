using Entities.Helpers;

namespace Entities.Dtos.FloorPlan;

public class PinPointAddDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Title { get; set; }
    public string FloorPlanId { get; set; }
}