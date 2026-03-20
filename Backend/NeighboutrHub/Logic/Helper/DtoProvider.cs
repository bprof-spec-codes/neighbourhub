using AutoMapper;
using Entities.Dtos.Announcement;
using Entities.Models;

namespace Logic.Helper;

public class DtoProvider
{
    public Mapper Mapper { get; set; }

    public DtoProvider()
    {
        var config = new MapperConfiguration(cfg => 
        {
            cfg.CreateMap<AnnouncementCreateDto, Announcement>();        
        });
        Mapper = new Mapper(config);
    }
}