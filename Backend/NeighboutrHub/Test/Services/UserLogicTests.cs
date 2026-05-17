using Entities.Dtos.User;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test.Services
{
    [TestFixture]
    public class UserLogicTests
    {
        private Mock<UserManager<AppUser>> _mockUserManager;
        private UserLogic _logic;

        [SetUp]
        public void Setup()
        {
            var store = new Mock<IUserStore<AppUser>>();
            _mockUserManager = new Mock<UserManager<AppUser>>(
                store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

            var settings = Options.Create(new Entities.Helpers.FileStorageSettings { StoragePath = "C:\\temp" });
            _logic = new UserLogic(_mockUserManager.Object, settings);
        }


        [Test]
        public async Task GetResidentByIdAsyncNonExistentUserShouldThrowException()
        {
            _mockUserManager.Setup(m => m.FindByIdAsync("nonexistent"))
                .ReturnsAsync((AppUser?)null);

            Assert.ThrowsAsync<KeyNotFoundException>(async () =>
                await _logic.GetResidentByIdAsync("nonexistent"));
        }

        [Test]
        public async Task UpdateResidentAsyncNonExistentUserShouldThrowException()
        {
            _mockUserManager.Setup(m => m.FindByIdAsync("nonexistent"))
                .ReturnsAsync((AppUser?)null);

            Assert.ThrowsAsync<KeyNotFoundException>(async () =>
                await _logic.UpdateResidentAsync("nonexistent", new AdminUpdateResidentDto
                {
                    FirstName = "Test",
                    LastName = "User",
                    Email = "test@test.com",
                    PhoneNumber = "+36201234567",
                    Storage = new List<string>(),
                    ParkingSpace = new List<string>(),
                    ApartmentNumber = new List<string>()
                }));
        
        }

        [Test]
        public async Task UpdateResidentAsyncInvalidEmailShouldThrowException()
        {
            var user = new AppUser { Id = "u1" };
            _mockUserManager.Setup(m => m.FindByIdAsync("u1")).ReturnsAsync(user);

            Assert.ThrowsAsync<ArgumentException>(async () =>
                await _logic.UpdateResidentAsync("u1", new AdminUpdateResidentDto
                {
                    FirstName = "Test",
                    LastName = "User",
                    Email = "notanemail",
                    PhoneNumber = "+36201234567",
                    ApartmentNumber = new List<string>(),
                    ParkingSpace = new List<string>(),
                    Storage = new List<string>()
                }));
        }


        [Test]
        public async Task UpdateResidentAsyncInvalidPhoneShouldThrowException()
        {
            var user = new AppUser { Id = "u1" };
            _mockUserManager.Setup(m => m.FindByIdAsync("u1")).ReturnsAsync(user);

            Assert.ThrowsAsync<ArgumentException>(async () =>
                await _logic.UpdateResidentAsync("u1", new AdminUpdateResidentDto
                {
                    FirstName = "Test",
                    LastName = "User",
                    Email = "test@test.com",
                    PhoneNumber = "invalidphone",
                    ApartmentNumber = new List<string>(),
                    ParkingSpace = new List<string>(),
                    Storage = new List<string>()
                }));
        }

        [Test]
        public async Task UpdateResidentAsyncDuplicateEmailShouldThrowException()
        {
            var user = new AppUser { Id = "u1" };
            var otherUser = new AppUser { Id = "u2", Email = "taken@test.com" };

            _mockUserManager.Setup(m => m.FindByIdAsync("u1")).ReturnsAsync(user);
            _mockUserManager.Setup(m => m.FindByEmailAsync("taken@test.com")).ReturnsAsync(otherUser);

            Assert.ThrowsAsync<ArgumentException>(async () =>
                await _logic.UpdateResidentAsync("u1", new AdminUpdateResidentDto
                {
                    FirstName = "Test",
                    LastName = "User",
                    Email = "taken@test.com",
                    PhoneNumber = "+36201234567",
                    ApartmentNumber = new List<string>(),
                    ParkingSpace = new List<string>(),
                    Storage = new List<string>()
                }));
        }

        [Test]
        public async Task UpdateResidentAsyncApartmentConflictShouldThrowException()
        {
            var user = new AppUser { Id = "u1" };
            var otherUser = new AppUser { Id = "u2", ApartmentNumber = new List<string> { "A1" } };

            _mockUserManager.Setup(m => m.FindByIdAsync("u1")).ReturnsAsync(user);
            _mockUserManager.Setup(m => m.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync((AppUser?)null);
            _mockUserManager.Setup(m => m.Users).Returns(new List<AppUser> { user, otherUser }.AsQueryable());

            Assert.ThrowsAsync<ArgumentException>(async () =>
                await _logic.UpdateResidentAsync("u1", new AdminUpdateResidentDto
                {
                    FirstName = "Test",
                    LastName = "User",
                    Email = "test@test.com",
                    PhoneNumber = "+36201234567",
                    ApartmentNumber = new List<string> { "A1" },
                    ParkingSpace = new List<string>(),
                    Storage = new List<string>()
                }));
        }

        [Test]
        public async Task UpdateResidentAsyncValidDataShouldSucceed()
        {
            var user = new AppUser { Id = "u1" };

            _mockUserManager.Setup(m => m.FindByIdAsync("u1")).ReturnsAsync(user);
            _mockUserManager.Setup(m => m.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync((AppUser?)null);
            _mockUserManager.Setup(m => m.Users).Returns(new List<AppUser> { user }.AsQueryable());
            _mockUserManager.Setup(m => m.UpdateAsync(It.IsAny<AppUser>())).ReturnsAsync(IdentityResult.Success);

            var result = await _logic.UpdateResidentAsync("u1", new AdminUpdateResidentDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@test.com",
                PhoneNumber = "+36201234567",
                ApartmentNumber = new List<string>(),
                ParkingSpace = new List<string>(),
                Storage = new List<string>()
            });

            Assert.That(result, Is.Empty);
            _mockUserManager.Verify(m => m.UpdateAsync(It.IsAny<AppUser>()), Times.Once);
        }
    }
}
