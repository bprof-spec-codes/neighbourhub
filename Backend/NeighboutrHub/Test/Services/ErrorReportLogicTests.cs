using Data;
using Entities.Dtos.ErrorReport;
using Entities.Models;
using Logic.Helper;
using Logic.Logic;
using MockQueryable;
using Moq;


namespace Test.Services
{
    [TestFixture]
    public class ErrorReportLogicTests
    {

        private Mock<Repository<ErrorReport>> _mockRepository;
        private ErrorReportLogic _logic;

        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<Repository<ErrorReport>>();
            _logic = new ErrorReportLogic(_mockRepository.Object, new DtoProvider());

        }

        [Test]
        public void UpdateNonExistentReportShouldReturnFalse()
        {
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReport>().BuildMock());

            var result = _logic.Update("nonexistent", new ErrorReportUpdateDto { Title = "Test", Description = "desc", Category = "Electrical", Priority = "High", Status = "Open" }, "user1", true);

            Assert.That(result, Is.False);
        }

        [Test]
        public void UpdateNotAdminShouldReturnFalse()
        {
            var report = new ErrorReport { Id = "r1" };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReport> { report }.BuildMock());

            var result = _logic.Update("r1", new ErrorReportUpdateDto { Title = "Test", Description = "desc", Category = "Electrical", Priority = "High", Status = "Open" }, "user1", false);

            Assert.That(result, Is.False);
        }


        [Test]
        public void UpdateAsAdminShouldReturnTrue()
        {
            var report = new ErrorReport { Id = "r1" };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReport> { report }.BuildMock());
            _mockRepository.Setup(r => r.Update(It.IsAny<ErrorReport>()));

            var dto = new ErrorReportUpdateDto { Title = "Fixed", Description = "desc", Category = "Electrical", Priority = "High", Status = "Open" };
            var result = _logic.Update("r1", dto, "admin", true);

            Assert.That(result, Is.True);
            _mockRepository.Verify(r => r.Update(It.IsAny<ErrorReport>()), Times.Once);
        }


        [Test]
        public void DeleteNonExistentReportShouldReturnFalse()
        {
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReport>().BuildMock());

            var result = _logic.Delete("nonexistent", "user1", true);

            Assert.That(result, Is.False);
        }

        [Test]
        public void DeleteNotAdminShouldReturnFalse()
        {
            var report = new ErrorReport { Id = "r1" };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReport> { report }.BuildMock());

            var result = _logic.Delete("r1", "user1", false);

            Assert.That(result, Is.False);
        }

        [Test]
        public void DeleteAsAdminShouldReturnTrue()
        {
            var report = new ErrorReport { Id = "r1" };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<ErrorReport> { report }.BuildMock());
            _mockRepository.Setup(r => r.Delete(It.IsAny<ErrorReport>()));

            var result = _logic.Delete("r1", "admin", true);

            Assert.That(result, Is.True);
            _mockRepository.Verify(r => r.Delete(It.IsAny<ErrorReport>()), Times.Once);
        }

    }
}
