using Data;
using Entities.Models;
using Logic.Helper;
using Logic.Logic;
using MockQueryable;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test.Services
{
    [TestFixture]
    public class MessageLogicTests
    {
        private Mock<Repository<Message>> _mockMessageRepository;
        private Mock<Repository<AppUser>> _mockUserRepository;
        private MessageLogic _logic;

        [SetUp]
        public void Setup()
        {
            _mockMessageRepository = new Mock<Repository<Message>>();
            _mockUserRepository = new Mock<Repository<AppUser>>();
            _logic = new MessageLogic(_mockMessageRepository.Object, new DtoProvider(), _mockUserRepository.Object);
        }


        [Test]
        public void MarkAsReadNonExistentMessageShouldThrowException()
        {
            _mockMessageRepository.Setup(r => r.GetAll())
                .Returns(new List<Message>().BuildMock());

            Assert.Throws<ArgumentException>(() => _logic.MarkAsRead("nonexistent", "user1"));
        }

        [Test]
        public void MarkAsReadNotOwnMessageShouldThrowException()
        {
            var message = new Message { Id = "m1", ReceiverId = "user1" };
            _mockMessageRepository.Setup(r => r.GetAll())
                .Returns(new List<Message> { message }.BuildMock());

            Assert.Throws<ArgumentException>(() => _logic.MarkAsRead("m1", "user2"));
        }

        [Test]
        public void MarkAsReadValidMessageShouldSetIsReadTrue()
        {
            var message = new Message { Id = "m1", ReceiverId = "user1", IsRead = false };
            _mockMessageRepository.Setup(r => r.GetAll())
                .Returns(new List<Message> { message }.BuildMock());
            _mockMessageRepository.Setup(r => r.Update(It.IsAny<Message>()));

            _logic.MarkAsRead("m1", "user1");

            Assert.That(message.IsRead, Is.True);
            _mockMessageRepository.Verify(r => r.Update(It.IsAny<Message>()), Times.Once);
        }

        [Test]
        public void DeleteMessageNonExistentShouldThrowException()
        {
            _mockMessageRepository.Setup(r => r.GetAll())
                .Returns(new List<Message>().BuildMock());

            Assert.Throws<ArgumentException>(() => _logic.DeleteMessage("nonexistent", "user1"));
        }

        [Test]
        public void DeleteMessageNotSenderOrReceiverShouldThrowException()
        {
            var message = new Message { Id = "m1", SenderId = "user1", ReceiverId = "user2" };
            _mockMessageRepository.Setup(r => r.GetAll())
                .Returns(new List<Message> { message }.BuildMock());

            Assert.Throws<ArgumentException>(() => _logic.DeleteMessage("m1", "user3"));
        }

        [Test]
        public void DeleteMessageBySenderShouldSetIsDeletedBySender()
        {
            var message = new Message { Id = "m1", SenderId = "user1", ReceiverId = "user2", IsDeletedBySender = false, IsDeletedByReceiver = false };
            _mockMessageRepository.Setup(r => r.GetAll())
                .Returns(new List<Message> { message }.BuildMock());
            _mockMessageRepository.Setup(r => r.Update(It.IsAny<Message>()));

            _logic.DeleteMessage("m1", "user1");

            Assert.That(message.IsDeletedBySender, Is.True);
            _mockMessageRepository.Verify(r => r.Update(It.IsAny<Message>()), Times.Once);
        }

        [Test]
        public void DeleteMessageByReceiverShouldSetIsDeletedByReceiver()
        {
            var message = new Message { Id = "m1", SenderId = "user1", ReceiverId = "user2", IsDeletedBySender = false, IsDeletedByReceiver = false };
            _mockMessageRepository.Setup(r => r.GetAll())
                .Returns(new List<Message> { message }.BuildMock());
            _mockMessageRepository.Setup(r => r.Update(It.IsAny<Message>()));

            _logic.DeleteMessage("m1", "user2");

            Assert.That(message.IsDeletedByReceiver, Is.True);
            _mockMessageRepository.Verify(r => r.Update(It.IsAny<Message>()), Times.Once);
        }

        [Test]
        public void DeleteMessageBothDeletedShouldPhysicallyDelete()
        {
            var message = new Message { Id = "m1", SenderId = "user1", ReceiverId = "user2", IsDeletedBySender = true, IsDeletedByReceiver = false };
            _mockMessageRepository.Setup(r => r.GetAll())
                .Returns(new List<Message> { message }.BuildMock());
            _mockMessageRepository.Setup(r => r.Delete(It.IsAny<Message>()));
            _mockMessageRepository.Setup(r => r.Update(It.IsAny<Message>()));

            _logic.DeleteMessage("m1", "user2");

            _mockMessageRepository.Verify(r => r.Delete(It.IsAny<Message>()), Times.Once);
        }
    }
}
