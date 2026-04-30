using Data;
using Entities.Dtos.Message;
using Entities.Dtos.User;
using Entities.Models;
using Logic.Helper;
using Microsoft.EntityFrameworkCore;

namespace Logic.Logic
{
    public class MessageLogic
    {

        private readonly Repository<Message> _messageRepository;
        private readonly DtoProvider _dtoProvider;
        private readonly Repository<AppUser> _userRepository;

        public MessageLogic(Repository<Message> messageRepository, DtoProvider dtoProvider, Repository<AppUser> userRepository)
        {
            _messageRepository = messageRepository;
            _dtoProvider = dtoProvider;
            _userRepository = userRepository;
        }

        public IEnumerable<RecipientDto> GetRecipients()
        {
            return _userRepository.GetAll()
                .Where(u => u.IsApproved)
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .Select(u => new RecipientDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    ApartmentNumber = u.ApartmentNumber
                })
                .ToList();
        }

        public IEnumerable<IncomingMessageDto> GetIncoming(string userId)
        {
            var messages = _messageRepository.GetAll()
                .Include(m => m.Sender)
                .Where(m => m.ReceiverId == userId && !m.IsDeletedByReceiver)
                .OrderByDescending(m => m.SentAt)
                .ToList();
            return _dtoProvider.Mapper.Map<List<IncomingMessageDto>>(messages);
        }

        public IEnumerable<SentMessageDto> GetSent(string userId)
        {
            var messages = _messageRepository.GetAll()
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId && !m.IsDeletedBySender)
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


        public void DeleteMessage(string messageId, string userId)
        {
            var message = _messageRepository.GetAll()
                .FirstOrDefault(m => m.Id == messageId);
            if (message == null)
                throw new ArgumentException("Az üzenet nem található.");
            if (message.SenderId != userId && message.ReceiverId != userId)
                throw new ArgumentException("Nincs jogosultságod törölni ezt az üzenetet.");
            if (message.SenderId == userId)
                message.IsDeletedBySender = true;
            if (message.ReceiverId == userId)
                message.IsDeletedByReceiver = true;
            if (message.IsDeletedBySender && message.IsDeletedByReceiver)
            {
                var replies = _messageRepository.GetAll()
                    .Where(m => m.ReplyToId == messageId)
                    .ToList();
                foreach (var reply in replies)
                {
                    reply.ReplyToId = null;
                    _messageRepository.Update(reply);
                }
                _messageRepository.Delete(message);
            }
            else
                _messageRepository.Update(message);
        }
    }
}
