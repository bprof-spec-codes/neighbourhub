using Data;
using Entities.Dtos.Booking;
using Entities.Enums;
using Entities.Models;
using Logic.Helper;
using Microsoft.EntityFrameworkCore;

namespace Logic.Logic;

public class BookingLogic
{
    private readonly Repository<Booking> _repository;
    private readonly DtoProvider _dtoProvider;

    public BookingLogic(Repository<Booking> repository, DtoProvider dtoProvider)
    {
        _repository = repository;
        _dtoProvider = dtoProvider;
    }

    public IEnumerable<BookingListDto> GetAll()
    {
        var bookings = _repository.GetAll()
            .Include(b => b.CommunityRoom)
            .Include(b => b.BookedBy)
            .OrderBy(b => b.BookingDate)
            .ThenBy(b => b.StartTime)
            .ToList();
        return _dtoProvider.Mapper.Map<List<BookingListDto>>(bookings);
    }

    public IEnumerable<BookingListDto> GetUpcoming(string userId)
    {
        var today = DateTime.UtcNow.Date;
        var bookings = _repository.GetAll()
            .Include(b => b.CommunityRoom)
            .Include(b => b.BookedBy)
            .Where(b => b.BookedById == userId
                && b.BookingDate >= today
                && b.Status != BookingStatus.Cancelled)
            .OrderBy(b => b.BookingDate)
            .ThenBy(b => b.StartTime)
            .ToList();
        return _dtoProvider.Mapper.Map<List<BookingListDto>>(bookings);
    }

    public IEnumerable<BookingListDto> GetPast(string userId)
    {
        var today = DateTime.UtcNow.Date;
        var bookings = _repository.GetAll()
            .Include(b => b.CommunityRoom)
            .Include(b => b.BookedBy)
            .Where(b => b.BookedById == userId && b.BookingDate < today)
            .OrderByDescending(b => b.BookingDate)
            .ThenBy(b => b.StartTime)
            .ToList();
        return _dtoProvider.Mapper.Map<List<BookingListDto>>(bookings);
    }

    public (bool success, string error) Create(BookingCreateDto dto, string userId)
    {
        if (dto.EndTime <= dto.StartTime)
            return (false, "End time must be after start time.");

        var conflict = _repository.GetAll().Any(b =>
            b.CommunityRoomId == dto.CommunityRoomId
            && b.BookingDate.Date == dto.BookingDate.Date
            && b.Status != BookingStatus.Cancelled
            && b.StartTime < dto.EndTime
            && b.EndTime > dto.StartTime);

        if (conflict)
            return (false, "The room is already booked for the selected time slot.");

        var booking = new Booking
        {
            CommunityRoomId = dto.CommunityRoomId,
            BookedById = userId,
            BookingDate = dto.BookingDate.Date,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            NumberOfPeople = dto.NumberOfPeople,
            Status = BookingStatus.Active
        };

        _repository.Add(booking);
        return (true, string.Empty);
    }

    public IEnumerable<BookingSlotDto> GetAvailability(string roomId, DateTime date)
    {
        return _repository.GetAll()
            .Where(b =>
                b.CommunityRoomId == roomId
                && b.BookingDate.Date == date.Date
                && b.Status != BookingStatus.Cancelled)
            .OrderBy(b => b.StartTime)
            .Select(b => new BookingSlotDto { StartTime = b.StartTime, EndTime = b.EndTime })
            .ToList();
    }

    public bool Cancel(string id, string userId, bool isAdmin)
    {
        var entity = _repository.GetAll().FirstOrDefault(b => b.Id == id);
        if (entity == null) return false;
        if (!isAdmin && entity.BookedById != userId) return false;

        entity.Status = BookingStatus.Cancelled;
        _repository.Update(entity);
        return true;
    }
}
