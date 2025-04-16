using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using uniPoint_backend;
using uniPoint_backend.Controllers;
using uniPoint_backend.Models;
using Xunit;
using Microsoft.EntityFrameworkCore.InMemory;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace uniPoint_backend_tests
{
    public class UserControllerTests
    {
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly Mock<RoleManager<IdentityRole>> _roleManagerMock;
        private readonly Mock<BlobService> _blobServiceMock;
        private readonly UserController _controller;
        private readonly IMapper _mapper;

        public UserControllerTests()
        {
            _userManagerMock = MockUserManager();
            _roleManagerMock = MockRoleManager();
            _blobServiceMock = new Mock<BlobService>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });

            _mapper = config.CreateMapper();

            var options = new DbContextOptionsBuilder<uniPointContext>()
    .UseInMemoryDatabase(databaseName: "TestReviewDb_" + System.Guid.NewGuid())
            .Options;

            var context = new uniPointContext(options);

            _controller = new UserController(
                _userManagerMock.Object,
                _roleManagerMock.Object,
                _blobServiceMock.Object,
                context,
                _mapper);
        }

        private Mock<UserManager<User>> MockUserManager()
        {
            var store = new Mock<IUserStore<User>>();
            return new Mock<UserManager<User>>(
                store.Object, null, null, null, null, null, null, null, null);
        }

        private Mock<RoleManager<IdentityRole>> MockRoleManager()
        {
            var store = new Mock<IRoleStore<IdentityRole>>();
            return new Mock<RoleManager<IdentityRole>>(
                store.Object, null, null, null, null);
        }

        private void SetUser(string userId, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role)
            };

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"))
                }
            };
        }

        [Fact]
        public async Task UpdateUser_UpdatesCorrectly_ForOwner()
        {
            var user = new User { Id = "1", UserName = "old" };

            _userManagerMock.Setup(um => um.FindByIdAsync("1")).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.UpdateAsync(It.IsAny<User>())).ReturnsAsync(IdentityResult.Success);

            SetUser("1", "User");

            var model = new UpdateUserModel
            {
                Name = "new",
                Email = "new@test.com",
                Location = "New City",
                ProfilePictureUrl = "url"
            };

            var result = await _controller.UpdateUser("1", model);
            var ok = Assert.IsType<OkObjectResult>(result);
            var updatedUser = Assert.IsType<User>(ok.Value);
            Assert.Equal("new", updatedUser.UserName);
        }

        [Fact]
        public async Task UpdateUser_ReturnsBadRequest_OnFailure()
        {
            var user = new User { Id = "1" };
            _userManagerMock.Setup(um => um.FindByIdAsync("1")).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "fail" }));

            SetUser("1", "User");

            var result = await _controller.UpdateUser("1", new UpdateUserModel());
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task DeleteUser_DeletesUser_WhenAuthorized()
        {
            var user = new User { Id = "1" };
            _userManagerMock.Setup(um => um.FindByIdAsync("1")).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.DeleteAsync(user)).ReturnsAsync(IdentityResult.Success);

            SetUser("1", "User");

            var result = await _controller.DeleteUser("1");
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User deleted successfully.", ok.Value);
        }

        [Fact]
        public async Task UploadProfilePicture_ReturnsBadRequest_WhenFileTooLarge()
        {
            SetUser("1", "User");

            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.FileName).Returns("pic.jpg");
            fileMock.Setup(f => f.Length).Returns(20 * 1024 * 1024);

            var result = await _controller.UploadProfilePicture("1", fileMock.Object);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("File size must be under 15MB.", badRequest.Value);
        }

        [Fact]
        public async Task UploadProfilePicture_ReturnsBadRequest_WhenUnsupportedExtension()
        {
            SetUser("1", "User");

            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.FileName).Returns("pic.txt");
            fileMock.Setup(f => f.Length).Returns(1024);

            var result = await _controller.UploadProfilePicture("1", fileMock.Object);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.StartsWith("Unsupported filetype", badRequest.Value.ToString());
        }
    }
}
