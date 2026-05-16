using Endpoint.Dtos;
using Entities.Dtos.FloorPlan;
using Entities.Helpers;
using Entities.Models;
using Logic.Logic;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Endpoint.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FloorPlanController : ControllerBase
{
    private FloorPlanLogic _floorPlanLogic;

    public FloorPlanController(FloorPlanLogic floorPlanLogic)
    {
        _floorPlanLogic = floorPlanLogic;
    }
    
    [HttpPost]
    public async Task<IActionResult> UploadDocument([FromForm] FloorPlanUploadDto request)
    {
        var floor = request.Floor;
        var file = request.Image;

        if (floor == null)
            return BadRequest("Floor is required");

        if (file == null)
            return BadRequest("No file uploaded");
        
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png")
            return BadRequest("Invalid file type");
        
        var fileData = (stream: file.OpenReadStream(), fileName: file.FileName, floor: floor);

        try
        {
            await _floorPlanLogic.UploadFloorImageAsync(fileData);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("addPinPoint")]
    public void AddPinPoint([FromBody] PinPointAddDto dto)
    {
        _floorPlanLogic.AddPinPoint(dto);
    }

    [HttpDelete("{id}")]
    public void DeletePinPoint(string id)
    {
        _floorPlanLogic.RemovePinPoint(id);
    }

    [HttpGet]
    public List<FloorPlan> GetFloorPlans()
    {
        return _floorPlanLogic.GetFloorPlans();
    }

    [HttpGet("{id}/image")]
    public IActionResult GetFloorPlanImage(string id)
    {
        try
        {
            var document = _floorPlanLogic.GetFloorPlanImage(id);

            var ext = Path.GetExtension(document.FileName).ToLowerInvariant();
            var contentType = ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };

            Response.Headers["Content-Disposition"] = $"inline; filename=\"{document.FileName}\"";
            var fileResult = new FileContentResult(document.Content, contentType)
            {
                EnableRangeProcessing = true
            };

            return fileResult;
        }
        catch (FileNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}