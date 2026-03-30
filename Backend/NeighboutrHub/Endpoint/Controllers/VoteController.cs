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
            return Ok(voteLogic.GetAll());
        }


        [HttpGet("active")]
        [Authorize]
        public IActionResult GetActive()
        {
            return Ok(voteLogic.GetActive());
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

            var result = voteLogic.Create(dto, userId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(string id)
        {
            voteLogic.Delete(id);
            return Ok();
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