using Data;
using Entities.Dtos.CommunityRoom;
using Entities.Models;
using Logic.Helper;

namespace Logic.Logic;

public class CommunityRoomLogic
{
    private readonly Repository<CommunityRoom> _repository;
    private readonly DtoProvider _dtoProvider;

    public CommunityRoomLogic(Repository<CommunityRoom> repository, DtoProvider dtoProvider)
    {
        _repository = repository;
        _dtoProvider = dtoProvider;
    }

    public IEnumerable<CommunityRoomListDto> GetAll()
    {
        var rooms = _repository.GetAll()
            .Where(r => r.IsActive)
            .OrderBy(r => r.Name)
            .ToList();
        return _dtoProvider.Mapper.Map<List<CommunityRoomListDto>>(rooms);
    }

    public IEnumerable<CommunityRoomListDto> GetAllForAdmin()
    {
        var rooms = _repository.GetAll()
            .OrderBy(r => r.Name)
            .ToList();
        return _dtoProvider.Mapper.Map<List<CommunityRoomListDto>>(rooms);
    }

    public string Add(CommunityRoomCreateDto dto)
    {
        var room = _dtoProvider.Mapper.Map<CommunityRoom>(dto);
        _repository.Add(room);
        return room.Id;
    }

    public bool Update(string id, CommunityRoomUpdateDto dto)
    {
        var entity = _repository.GetAll().FirstOrDefault(r => r.Id == id);
        if (entity == null) return false;

        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.Capacity = dto.Capacity;
        entity.IsActive = dto.IsActive;

        _repository.Update(entity);
        return true;
    }

    public bool Delete(string id)
    {
        var entity = _repository.GetAll().FirstOrDefault(r => r.Id == id);
        if (entity == null) return false;

        entity.IsActive = false;
        _repository.Update(entity);
        return true;
    }
}
