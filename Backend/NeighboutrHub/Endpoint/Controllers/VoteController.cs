using Logic.Logic;
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
        public IActionResult GetAll()
        {
            return Ok(voteLogic.GetAll());
        }


        [HttpGet("active")]
        public IActionResult GetActive()
        {
            return Ok(voteLogic.GetActive());
        }


        [HttpGet("inactive")]
        public IActionResult GetInactive()
        {
            return Ok(voteLogic.GetInactive());
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            voteLogic.Delete(id);
            return Ok();
        }
    }
}