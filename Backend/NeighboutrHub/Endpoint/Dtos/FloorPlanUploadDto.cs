namespace Endpoint.Dtos;

public class FloorPlanUploadDto
{
    public int Floor { get; set; }
    public IFormFile Image { get; set; }
}