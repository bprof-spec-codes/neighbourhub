using Data;
using Entities.Dtos.CommunityRoom;
using Entities.Models;
using Logic.Helper;
using Logic.Logic;
using MockQueryable;
using Moq;


namespace Test.Services
{
    [TestFixture]
    public class CommunityRoomLogicTests
    {

        private Mock<Repository<CommunityRoom>> _mockRepository;
        private CommunityRoomLogic _communityRoomLogic;

        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<Repository<CommunityRoom>>();
            _communityRoomLogic = new CommunityRoomLogic(_mockRepository.Object, new DtoProvider());
        }

        [Test]
        public void UpdateNonExistentRoomShouldReturnFalse()
        {

            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<CommunityRoom>().BuildMock());

            var result = _communityRoomLogic.Update("nonexistent", new CommunityRoomUpdateDto { Name = "Test" });


            Assert.That(result, Is.False);
        }

        [Test]
        public void UpdateValidRoomShouldReturnTrue()
        {

            var room = new CommunityRoom { Id = "room1", Name = "Old Name", IsActive = true };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<CommunityRoom> { room }.BuildMock());
            _mockRepository.Setup(r => r.Update(It.IsAny<CommunityRoom>()));


            var dto = new CommunityRoomUpdateDto { Name = "New Name", Capacity = 10, IsActive = true };
            var result = _communityRoomLogic.Update("room1", dto);


            Assert.That(result, Is.True);
            _mockRepository.Verify(r => r.Update(It.IsAny<CommunityRoom>()), Times.Once);
        }

        [Test]
        public void DeleteNonExistentRoomShouldReturnFalse()
        {

            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<CommunityRoom>().BuildMock());

            var result = _communityRoomLogic.Delete("nonexistent");

            Assert.That(result, Is.False);
        }


        [Test]
        public void DeleteValidRoomShouldSoftDeleteAndReturnTrue()
        {
            var room = new CommunityRoom { Id = "room1", Name = "Room", IsActive = true };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<CommunityRoom> { room }.BuildMock());
            _mockRepository.Setup(r => r.Update(It.IsAny<CommunityRoom>()));


            var result = _communityRoomLogic.Delete("room1");

            Assert.That(result, Is.True);
            _mockRepository.Verify(r => r.Update(It.Is<CommunityRoom>(r => r.IsActive == false)), Times.Once);
        }
    }
}
