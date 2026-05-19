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
    public class ErrorReportCommentLogicTests
    {

        private Mock<Repository<ErrorReportComment>> _mockRepository;
        private ErrorReportCommentLogic _logic;


        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<Repository<ErrorReportComment>>();
            _logic = new ErrorReportCommentLogic(_mockRepository.Object, new DtoProvider());
        }


        [Test]
        public void DeleteNonExistentCommentShouldReturnFalse()
        {
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReportComment>().BuildMock());

            var result = _logic.Delete("nonexistent", "user1", false);

            Assert.That(result, Is.False);
        }

        [Test]
        public void DeleteWrongUserNotAdminShouldReturnFalse()
        {
            var comment = new ErrorReportComment { Id = "c1", AuthorId = "user1" };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReportComment> { comment }.BuildMock());

            var result = _logic.Delete("c1", "user2", false);

            Assert.That(result, Is.False);
        }

        [Test]
        public void DeleteAsAdminShouldReturnTrue()
        {
            var comment = new ErrorReportComment { Id = "c1", AuthorId = "user1" };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReportComment> { comment }.BuildMock());
            _mockRepository.Setup(r => r.Delete(It.IsAny<ErrorReportComment>()));

            var result = _logic.Delete("c1", "adminUser", true);

            Assert.That(result, Is.True);
            _mockRepository.Verify(r => r.Delete(It.IsAny<ErrorReportComment>()), Times.Once);
        }

        [Test]
        public void DeleteOwnCommentShouldReturnTrue()
        {
            var comment = new ErrorReportComment { Id = "c1", AuthorId = "user1" };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReportComment> { comment }.BuildMock());
            _mockRepository.Setup(r => r.Delete(It.IsAny<ErrorReportComment>()));

            var result = _logic.Delete("c1", "user1", false);

            Assert.That(result, Is.True);
            _mockRepository.Verify(r => r.Delete(It.IsAny<ErrorReportComment>()), Times.Once);
        }
    }
}
