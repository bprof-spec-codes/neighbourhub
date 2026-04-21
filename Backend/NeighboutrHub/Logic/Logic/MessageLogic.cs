using Data;
using Entities.Dtos.Message;
using Entities.Models;
using Logic.Helper;
using Microsoft.EntityFrameworkCore;

namespace Logic.Logic
{
    public class MessageLogic
    {

        private readonly Repository<Message> _messageRepository;
        private readonly DtoProvider _dtoProvider;

        public MessageLogic(Repository<Message> messageRepository, DtoProvider dtoProvider)
        {
            _messageRepository = messageRepository;
            _dtoProvider = dtoProvider;
        }

        public IEnumerable<IncomingMessageDto> GetIncoming(string userId)
        {
            var messages = _messageRepository.GetAll()
                .Include(m => m.Sender)
                .Where(m => m.ReceiverId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToList();
            return _dtoProvider.Mapper.Map<List<IncomingMessageDto>>(messages);
        }

        public IEnumerable<SentMessageDto> GetSent(string userId)
        {
            var messages = _messageRepository.GetAll()
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToList();
            return _dtoProvider.Mapper.Map<List<SentMessageDto>>(messages);

        }

        public void SendMessage(CreateMessageDto dto, string senderId)
        {
            var message = _dtoProvider.Mapper.Map<Message>(dto);
            message.SenderId = senderId;
            message.SentAt = DateTime.Now;
            _messageRepository.Add(message);
        }

        public void MarkAsRead(string messageId, string userId)
        {
            var message = _messageRepository.GetAll()
                .FirstOrDefault(m => m.Id == messageId && m.ReceiverId == userId);
            if (message == null)
                throw new ArgumentException("Az üzenet nem található.");
            message.IsRead = true;
            _messageRepository.Update(message);
        }

    }
}
