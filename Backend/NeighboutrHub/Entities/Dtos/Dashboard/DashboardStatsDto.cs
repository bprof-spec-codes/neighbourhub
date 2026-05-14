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
        // A grafikon értékei (pl: [5, 12, 8, 20, 15])
        public List<int> WeeklyActivity { get; set; }

        // A grafikon alatti feliratok (pl: ["Hétfő", "Kedd", ...] vagy ["05.10", "05.11", ...])
        public List<string> ActivityLabels { get; set; }
    }
}
