using AutoMapper;
using Entities.Dtos.Announcement;
using Entities.Dtos.ErrorReport;
using Entities.Dtos.Vote;
using Entities.Enums;
using Entities.Models;
using Logic.Logic;

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

            cfg.CreateMap<ErrorReportCreateDto, ErrorReport>()
                .ForMember(d => d.Category, o => o.MapFrom(s => Enum.Parse<ErrorCategory>(s.Category, true)));

            cfg.CreateMap<ErrorReport, ErrorReportDetailDto>()
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Category.ToString()))
                .ForMember(d => d.Priority, o => o.MapFrom(s => s.Priority.ToString()))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
                .ForMember(d => d.ReportedByName, o => o.MapFrom(s => s.ReportedBy != null ? s.ReportedBy.FirstName + " " + s.ReportedBy.LastName : ""));

            cfg.CreateMap<CreateVoteDto, Vote>()
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.CreatedByUserId, o => o.Ignore())
                .ForMember(d => d.CreatedByUser, o => o.Ignore())
                .ForMember(d => d.Entries, o => o.Ignore());

            cfg.CreateMap<Document, DocumentShortViewDto>();
        });
        Mapper = new Mapper(config);
    }
}