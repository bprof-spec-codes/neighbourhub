using Entities.Dtos.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Logic.Logic;

namespace Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Csak bejelentkezett felhasználóknak
    public class DashboardController : ControllerBase
    {
        private readonly DashboardLogic _dashboardLogic;

        public DashboardController(DashboardLogic dashboardLogic)
        {
            _dashboardLogic = dashboardLogic;
        }

        [HttpGet]
        public ActionResult<DashboardStatsDto> GetStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Nem található felhasználó a tokenben.");
            }

            var stats = _dashboardLogic.GetDashboardStats(userId);
            return Ok(stats);
        }
    }
}