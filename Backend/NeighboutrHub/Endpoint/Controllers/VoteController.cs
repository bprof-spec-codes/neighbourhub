using Entities.Dtos.Vote;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VoteController : ControllerBase
    {
        private readonly VoteLogic voteLogic;

        public VoteController(VoteLogic voteLogic)
        {
            this.voteLogic = voteLogic;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAll()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return Ok(voteLogic.GetAll(userId));
        }


        [HttpGet("active")]
        [Authorize]
        public IActionResult GetActive()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return Ok(voteLogic.GetActive(userId));
        }


        [HttpGet("inactive")]
        [Authorize]
        public IActionResult GetInactive()
        {
            return Ok(voteLogic.GetInactive());
        }

        [HttpPost]
        [Authorize]
        public IActionResult Create(CreateVoteDto dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = voteLogic.Create(dto, userId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(string id)
        {

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var isAdmin = User.IsInRole("Admin");

            try
            {
                voteLogic.Delete(id, userId, isAdmin);
                return Ok();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
        }

        [HttpPost("{id}/entry")]
        [Authorize]
        public IActionResult CastVote(string id, [FromBody] CastVoteDto dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();
            voteLogic.CastVote(id, userId, dto.Option);
            return Ok();
        }
    }
}