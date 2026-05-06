using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos.Dashboard
{
    public class DashboardStatsDto
    {
        public int ActiveVotes { get; set; }
        public int UnreadMessages { get; set; }
        public int PendingBookings { get; set; }
        public int RecentUpdates { get; set; }
        public List<int> WeeklyActivity { get; set; } // A grafikon oszlopaihoz
    }
}
