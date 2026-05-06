using Data;
using Entities.Dtos.Dashboard;
using Entities.Enums;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic.Logic
{
    public class DashboardLogic
    {
        // Itt több repository-t is be kell injektálni
        private readonly Repository<Vote> _voteRepo;
        private readonly Repository<Message> _messageRepo;
        private readonly Repository<Booking> _bookingRepo;
        private readonly Repository<Announcement> _announcementRepo;

        public DashboardLogic(
            Repository<Vote> voteRepo,
            Repository<Message> messageRepo,
            Repository<Booking> bookingRepo,
            Repository<Announcement> announcementRepo)
        {
            _voteRepo = voteRepo;
            _messageRepo = messageRepo;
            _bookingRepo = bookingRepo;
            _announcementRepo = announcementRepo;
        }

        public DashboardStatsDto GetDashboardStats(string userId)
        {
            return new DashboardStatsDto
            {
                ActiveVotes = _voteRepo.GetAll()
                    .AsEnumerable()
                    .Count(v => v.IsActive),

                UnreadMessages = _messageRepo.GetAll()
                   .Count(m => m.ReceiverId == userId.ToString() && !m.IsRead),

                PendingBookings = _bookingRepo.GetAll()
                   .Count(b => b.Status == BookingStatus.Active),

                RecentUpdates = _announcementRepo.GetAll()
                    .Count(a => a.CreatedDate > DateTime.Now.AddDays(-2)),

                // A grafikonhoz: pl. az elmúlt 5 nap eseményszámai
                WeeklyActivity = new List<int> { 12, 19, 7, 25, 15 }
            };
        }
    }
}