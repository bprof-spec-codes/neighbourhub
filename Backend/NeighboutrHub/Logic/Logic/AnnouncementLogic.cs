using Data;
using Entities.Dtos.Announcement;
using Entities.Models;
using Logic.Helper;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace Logic.Logic;

public class AnnouncementLogic
{
    private Repository<Announcement> _announcementRepository;
    private DtoProvider _dtoProvider;

    public AnnouncementLogic(Repository<Announcement> announcementRepository, DtoProvider dtoProvider)
    {
        _announcementRepository = announcementRepository;
        _dtoProvider = dtoProvider;
    }

    public void AddAnnouncement(AnnouncementCreateDto dto)
    {
        var announcementToAdd = _dtoProvider.Mapper.Map<Announcement>(dto);
        _announcementRepository.Add(announcementToAdd);
    }

    public IEnumerable<Announcement> GetAnnouncements()
    {
        return _announcementRepository.GetAll();
    }
}