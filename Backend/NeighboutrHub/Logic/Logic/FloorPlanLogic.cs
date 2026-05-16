using Data;
using Entities.Dtos.FloorPlan;
using Entities.Helpers;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Logic.Logic;

public class FloorPlanLogic
{
    private FileStorageSettings _fileStorage;
    private Repository<FloorPlan> _floorPlanRepository;
    private Repository<PinPoint> _pinPointRepository;

    public FloorPlanLogic(IOptions<FileStorageSettings> fileStorage, Repository<FloorPlan> floorPlanRepository, Repository<PinPoint> pinPointRepository)
    {
        _fileStorage = fileStorage.Value;
        _floorPlanRepository = floorPlanRepository;
        _pinPointRepository = pinPointRepository;
    }

    public async Task UploadFloorImageAsync((Stream fileStream, string fileName, int floor) file)
    {
        var fileName = file.fileName;
        var path = Path.Combine(_fileStorage.StoragePath, "uploads", "floorPlans", file.fileName);

        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        await using (var output = new FileStream(path, FileMode.Create))
        {
            await file.fileStream.CopyToAsync(output);
        }
        
        var relativePath = $"uploads/floorPlans/{fileName}";
        
        FloorPlan floorPlan = new FloorPlan()
        {
            Floor = file.floor,
            ImageUrl = relativePath,
            PinPoints = new List<PinPoint>()
        };
        
        _floorPlanRepository.Add(floorPlan);
        _floorPlanRepository.Update(floorPlan);
    }

    public void AddPinPoint(PinPointAddDto dto)
    {
        var floorPlan = _floorPlanRepository.GetAll().Include(x => x.PinPoints).FirstOrDefault(x => x.Id == dto.FloorPlanId);
        if (floorPlan == null)
            throw new Exception("No floor plan with that id");
        
        if (dto.Latitude < 0 || dto.Longitude < 0 || dto.Latitude > 100 || dto.Longitude > 100)
            throw new Exception("Latitude and longitude must be between 0 and 100");
        
        PinPoint pinPoint = new PinPoint(dto.Title, dto.Latitude, dto.Longitude);
        
        floorPlan.PinPoints.Add(pinPoint);
        
        _floorPlanRepository.Update(floorPlan);
    }

    public void RemovePinPoint(string pinPointId)
    {
        var floorPlan = _floorPlanRepository.GetAll().Include(x => x.PinPoints).FirstOrDefault(x => x.PinPoints.Any(p => p.Id == pinPointId));
        if (floorPlan == null)
            throw new Exception("No floor plan with that pin point id");

        var pinPoint = floorPlan.PinPoints.FirstOrDefault(p => p.Id == pinPointId);
        if (pinPoint == null)
            throw new Exception("No pin point with that id");

        _pinPointRepository.DeleteById(pinPointId);

        _floorPlanRepository.Update(floorPlan);
    }
}