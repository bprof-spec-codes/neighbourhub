using Entities.Helpers;
using System.ComponentModel.DataAnnotations;


namespace Entities.Models
{
    public class Message : IIdEntity
    {
        public Message()
        {
            Id = Guid.NewGuid().ToString();
        }

        [Key]
        [StringLength(50)]
        public string Id { get; set; }

        [StringLength(450)]
        public string SenderId { get; set; } = string.Empty;
        public AppUser Sender { get; set; } = null!;

        [StringLength(450)]
        public string ReceiverId { get; set; } = string.Empty;
        public AppUser Receiver { get; set; } = null!;

        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;

        public string Body { get; set; } = string.Empty;

        public DateTime SentAt { get; set; } = DateTime.Now;

        public bool IsRead { get; set; } = false;

        public string? ReplyToId { get; set; }
        public Message? ReplyTo { get; set; }

    }
}
