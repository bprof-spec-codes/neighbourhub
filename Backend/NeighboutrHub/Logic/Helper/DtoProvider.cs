using AutoMapper;
using Entities.Dtos.Announcement;
using Entities.Dtos.ErrorReport;
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

            cfg.CreateMap<ErrorReport, ErrorReportListDto>()
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Category.ToString()))
                .ForMember(d => d.Priority, o => o.MapFrom(s => s.Priority.ToString()))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));
        });
        Mapper = new Mapper(config);
    }
}