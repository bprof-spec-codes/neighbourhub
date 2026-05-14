using Data;
using Entities.Dtos.Dashboard;
using Entities.Enums;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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
        private readonly Repository<UserLoginLog> _loginRepo;

        public DashboardLogic(
            Repository<Vote> voteRepo,
            Repository<Message> messageRepo,
            Repository<Booking> bookingRepo,
            Repository<Announcement> announcementRepo,
            Repository<UserLoginLog> loginRepo)
        {
            _voteRepo = voteRepo;
            _messageRepo = messageRepo;
            _bookingRepo = bookingRepo;
            _announcementRepo = announcementRepo;
            _loginRepo = loginRepo;
        }

        public DashboardStatsDto GetDashboardStats(string userId)
        {
            var today = DateTime.Now.Date;
            var startDate = today.AddDays(-4);

            // 1. Adatok lekérése a különböző táblákból az adott userre
            // Fontos: Itt feltételezzük, hogy a UserLoginLogs tábla létezik a context-ben
            var logins = _loginRepo.GetAll()
                .Where(l => l.UserId == userId && l.LoginDate >= startDate).ToList();

            var votes = _voteRepo.GetAll()
                .Where(v => v.CreatedByUserId == userId && v.Deadline >= startDate).ToList();

            var messages = _messageRepo.GetAll()
                .Where(m => m.SenderId == userId && m.SentAt >= startDate).ToList();

            var activityList = new List<int>();
            var labelsList = new List<string>();

            // 2. Pontok és dátumok kiszámítása naponként
            for (int i = 0; i < 5; i++)
            {
                var currentDay = startDate.AddDays(i);

                // Pontozási logika
                int loginPoints = logins.Count(l => l.LoginDate.Date == currentDay) * 1;
                int votePoints = votes.Count(v => v.CreatedByUserId == userId && v.Deadline.Date == currentDay) * 3;
                int messagePoints = messages.Count(m => m.SenderId == userId && m.SentAt.Date == currentDay) * 5;

                activityList.Add(loginPoints + votePoints + messagePoints);

                // Felirat hozzáadása (pl.: "05.14" vagy "Csütörtök")
                labelsList.Add(currentDay.ToString("MM.dd"));
            }
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
                WeeklyActivity = activityList
            };
        }
    }
}