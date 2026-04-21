using Entities.Dtos.Message;
using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly MessageLogic _messageLogic;

        public MessageController(MessageLogic messageLogic)
        {
            _messageLogic = messageLogic;
        }


        [HttpGet("incoming")]
        [Authorize]
        public IActionResult GetIncoming()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            return Ok(_messageLogic.GetIncoming(userId));
        }

        [HttpGet("sent")]
        [Authorize]
        public IActionResult GetSent()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            return Ok(_messageLogic.GetSent(userId));
        }


        [HttpPost]
        [Authorize]
        public IActionResult SendMessage(CreateMessageDto dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            _messageLogic.SendMessage(dto, userId);
            return Ok();
        }

        [HttpPatch("{id}/read")]
        [Authorize]
        public IActionResult MarkAsRead(string id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            try
            {
                _messageLogic.MarkAsRead(id, userId);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
