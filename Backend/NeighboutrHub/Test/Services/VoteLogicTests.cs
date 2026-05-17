using Data;
using Entities.Dtos.Vote;
using Entities.Enums;
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
    public class VoteLogicTests
    {

        private Mock<Repository<Vote>> _mockVoteRepository;
        private Mock<Repository<VoteEntry>> _mockVoteEntryRepository;
        private VoteLogic _logic;

        [SetUp]
        public void Setup()
        {
            _mockVoteRepository = new Mock<Repository<Vote>>();
            _mockVoteEntryRepository = new Mock<Repository<VoteEntry>>();
            _logic = new VoteLogic(_mockVoteRepository.Object, _mockVoteEntryRepository.Object, new DtoProvider());
            
        }

        [Test]
        public void CreateExpiredDeadlineShouldThrowException()
        {
            var dto = new CreateVoteDto { Title = "Test", Deadline = DateTime.Now.AddDays(-1) };

            Assert.Throws<ArgumentException>(() => _logic.Create(dto, "user1"));
        }

        [Test]
        public void CreateValidVoteShouldSucceed()
        {
            var dto = new CreateVoteDto { Title = "Test", Deadline = DateTime.Now.AddDays(5) };
            _mockVoteRepository.Setup(r => r.Add(It.IsAny<Vote>()));

            var result = _logic.Create(dto, "user1");

            Assert.That(result, Is.Not.Null);
            Assert.That(result.CreatedByUserId, Is.EqualTo("user1"));
            _mockVoteRepository.Verify(r => r.Add(It.IsAny<Vote>()), Times.Once);
        }

        [Test]
        public void DeleteNonExistentVoteShouldThrowException()
        {
            _mockVoteRepository.Setup(r => r.GetAll())
                .Returns(new List<Vote>().BuildMock());

            Assert.Throws<ArgumentException>(() => _logic.Delete("nonexistent", "user1", false));
        }

        [Test]
        public void DeleteNotAdminNotOwnerShouldThrowException()
        {
            var vote = new Vote { Id = "v1", CreatedByUserId = "user1" };
            _mockVoteRepository.Setup(r => r.GetAll())
                .Returns(new List<Vote> { vote }.BuildMock());


            Assert.Throws<UnauthorizedAccessException>(() => _logic.Delete("v1", "user2", false));
        }

        [Test]
        public void DeleteAsOwnerShouldSucceed()
        {
            var vote = new Vote { Id = "v1", CreatedByUserId = "user1" };
            _mockVoteRepository.Setup(r => r.GetAll())
                .Returns(new List<Vote> { vote }.BuildMock());
            _mockVoteEntryRepository.Setup(r => r.GetAll())
                .Returns(new List<VoteEntry>().BuildMock());
            _mockVoteEntryRepository.Setup(r => r.DeleteRange(It.IsAny<IEnumerable<VoteEntry>>()));
            _mockVoteRepository.Setup(r => r.DeleteById(It.IsAny<string>()));


            _logic.Delete("v1", "user1", false);


            _mockVoteRepository.Verify(r => r.DeleteById("v1"), Times.Once);
        }

        [Test]
        public void CastVoteNonExistentVoteShouldThrowException()
        {
            _mockVoteRepository.Setup(r => r.GetAll())
                .Returns(new List<Vote>().BuildMock());

            Assert.Throws<ArgumentException>(() => _logic.CastVote("nonexistent", "user1", VoteOption.Yes));
        }

        [Test]
        public void CastVoteInactiveVoteShouldThrowException()
        {

            var vote = new Vote { Id = "v1", Deadline = DateTime.Now.AddDays(-1) };
            _mockVoteRepository.Setup(r => r.GetAll())
                .Returns(new List<Vote> { vote }.BuildMock());


            Assert.Throws<ArgumentException>(() => _logic.CastVote("v1", "user1", VoteOption.Yes));
        }

        [Test]
        public void CastVoteAlreadyVotedShouldThrowException()
        {


            var vote = new Vote { Id = "v1", Deadline = DateTime.Now.AddDays(5) };
            _mockVoteRepository.Setup(r => r.GetAll())
                .Returns(new List<Vote> { vote }.BuildMock());

            var entry = new VoteEntry { VoteId = "v1", UserId = "user1" };
            _mockVoteEntryRepository.Setup(r => r.GetAll())
                .Returns(new List<VoteEntry> { entry }.BuildMock());

            Assert.Throws<ArgumentException>(() => _logic.CastVote("v1", "user1", VoteOption.Yes));
        }

        [Test]
        public void CastVoteValidShouldAddEntry()
        {

            var vote = new Vote { Id = "v1", Deadline = DateTime.Now.AddDays(5) };
            _mockVoteRepository.Setup(r => r.GetAll())
                .Returns(new List<Vote> { vote }.BuildMock());
            _mockVoteEntryRepository.Setup(r => r.GetAll())
                .Returns(new List<VoteEntry>().BuildMock());
            _mockVoteEntryRepository.Setup(r => r.Add(It.IsAny<VoteEntry>()));


            _logic.CastVote("v1", "user1", VoteOption.Yes);

            _mockVoteEntryRepository.Verify(r => r.Add(It.IsAny<VoteEntry>()), Times.Once);
        }
    }
}
