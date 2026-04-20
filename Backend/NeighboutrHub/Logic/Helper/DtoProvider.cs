using AutoMapper;
using Entities.Dtos.Announcement;
using Entities.Dtos.Booking;
using Entities.Dtos.CommunityRoom;
using Entities.Dtos.ErrorReport;
using Entities.Dtos.Vote;
using Entities.Enums;
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

            cfg.CreateMap<CommunityRoomCreateDto, CommunityRoom>();

            cfg.CreateMap<CommunityRoom, CommunityRoomListDto>();

            cfg.CreateMap<Booking, BookingListDto>()
                .ForMember(d => d.RoomName, o => o.MapFrom(s => s.CommunityRoom != null ? s.CommunityRoom.Name : ""))
                .ForMember(d => d.BookedByName, o => o.MapFrom(s => s.BookedBy != null ? s.BookedBy.FirstName + " " + s.BookedBy.LastName : ""))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));
        });
        Mapper = new Mapper(config);
    }
}