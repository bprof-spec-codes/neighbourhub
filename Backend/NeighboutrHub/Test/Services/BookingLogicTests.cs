using Data;
using Entities.Dtos.Booking;
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
    public class BookingLogicTests
    {
        private Mock<Repository<Booking>> _mockRepository;
        private BookingLogic _bookingLogic;


        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<Repository<Booking>>();
            _bookingLogic = new BookingLogic(_mockRepository.Object, new DtoProvider());
        }


        [Test]
        public void CreateEndTimeBeforeStartTimeShouldReturnError()
        {
            var dto = new BookingCreateDto
            {
                CommunityRoomId = "room1",
                BookingDate = DateTime.Today,
                StartTime = TimeOnly.FromTimeSpan(TimeSpan.FromHours(10)),
                EndTime = TimeOnly.FromTimeSpan(TimeSpan.FromHours(9))
            };

            var (success, error) = _bookingLogic.Create(dto, "user1");

            Assert.That(success, Is.False);
            Assert.That(error, Is.EqualTo("End time must be after start time."));
        }

        [Test]
        public void CreateConflictingBookingShouldReturnError()
        {
            var existing = new Booking
            {
                Id = "b1",
                CommunityRoomId = "room1",
                BookingDate = DateTime.Today,
                StartTime = TimeOnly.FromTimeSpan(TimeSpan.FromHours(9)),
                EndTime = TimeOnly.FromTimeSpan(TimeSpan.FromHours(11)),
                Status = BookingStatus.Active
            };

            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<Booking> { existing }.BuildMock());

            var dto = new BookingCreateDto
            {
                CommunityRoomId = "room1",
                BookingDate = DateTime.Today,
                StartTime = TimeOnly.FromTimeSpan(TimeSpan.FromHours(10)),
                EndTime = TimeOnly.FromTimeSpan(TimeSpan.FromHours(12))
            };

            var (success, error) = _bookingLogic.Create(dto, "user1");

            Assert.That(success, Is.False);
            Assert.That(error, Is.EqualTo("The room is already booked for the selected time slot."));
        }

        [Test]
        public void CreateValidBookingShouldSucceed()
        {
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<Booking>().BuildMock());

            var dto = new BookingCreateDto
            {
                CommunityRoomId = "room1",
                BookingDate = DateTime.Today,
                StartTime = TimeOnly.FromTimeSpan(TimeSpan.FromHours(9)),
                EndTime = TimeOnly.FromTimeSpan(TimeSpan.FromHours(11))
            };

            var (success, error) = _bookingLogic.Create(dto, "user1");

            Assert.That(success, Is.True);
            Assert.That(error, Is.Empty);
            _mockRepository.Verify(r => r.Add(It.IsAny<Booking>()), Times.Once);
        }

        [Test]
        public void CancelNonExistentBookingShouldReturnFalse()
        {
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<Booking>().BuildMock());

            var result = _bookingLogic.Cancel("nonexistent", "user1", false);

            Assert.That(result, Is.False);
        }

        [Test]
        public void CancelWrongUserNotAdminShouldReturnFalse()
        {
            var booking = new Booking { Id = "b1", BookedById = "user1", Status = BookingStatus.Active };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<Booking> { booking }.BuildMock());

            var result = _bookingLogic.Cancel("b1", "user2", false);

            Assert.That(result, Is.False);
        }

        [Test]
        public void CancelAsAdminShouldSucceed()
        {
            var booking = new Booking { Id = "b1", BookedById = "user1", Status = BookingStatus.Active };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<Booking> { booking }.BuildMock());
            _mockRepository.Setup(r => r.Update(It.IsAny<Booking>()));

            var result = _bookingLogic.Cancel("b1", "adminUser", true);

            Assert.That(result, Is.True);
            _mockRepository.Verify(r => r.Update(It.IsAny<Booking>()), Times.Once);
        }

        [Test]
        public void CancelOwnBookingShouldSucceed()
        {
            var booking = new Booking { Id = "b1", BookedById = "user1", Status = BookingStatus.Active };
            _mockRepository.Setup(r => r.GetAll())
                .Returns(new List<Booking> { booking }.BuildMock());
            _mockRepository.Setup(r => r.Update(It.IsAny<Booking>()));

            var result = _bookingLogic.Cancel("b1", "user1", false);

            Assert.That(result, Is.True);
            _mockRepository.Verify(r => r.Update(It.IsAny<Booking>()), Times.Once);
        }

    }
}
