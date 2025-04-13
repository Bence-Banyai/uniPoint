using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using uniPoint_backend.Controllers;
using uniPoint_backend.Models;
using Xunit;

namespace uniPoint_backend_tests
{
    public class AuthControllerTests
    {
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly Mock<SignInManager<User>> _signInManagerMock;
        private readonly Mock<RoleManager<IdentityRole>> _roleManagerMock;
        private readonly IConfiguration _configuration;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _userManagerMock = MockUserManager();
            _signInManagerMock = MockSignInManager();
            _roleManagerMock = MockRoleManager();
            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    {"JwtSettings:Secret", "supersecretkeymustbeatleast16chars"},
                    {"JwtSettings:Issuer", "TestIssuer"},
                    {"JwtSettings:Audience", "TestAudience"},
                    {"JwtSettings:ExpirationInMinutes", "60"}
                })
                .Build();

            _controller = new AuthController(
                _userManagerMock.Object,
                _signInManagerMock.Object,
                _roleManagerMock.Object,
                _configuration
            );
        }

        private Mock<UserManager<User>> MockUserManager()
        {
            var store = new Mock<IUserStore<User>>();
            return new Mock<UserManager<User>>(store.Object, null, null, null, null, null, null, null, null);
        }

        private Mock<SignInManager<User>> MockSignInManager()
        {
            var userManager = MockUserManager();
            var contextAccessor = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
            var claimsFactory = new Mock<IUserClaimsPrincipalFactory<User>>();
            return new Mock<SignInManager<User>>(
                userManager.Object,
                contextAccessor.Object,
                claimsFactory.Object,
                null,
                null,
                null,
                null);
        }

        private Mock<RoleManager<IdentityRole>> MockRoleManager()
        {
            var store = new Mock<IRoleStore<IdentityRole>>();
            return new Mock<RoleManager<IdentityRole>>(store.Object, null, null, null, null);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenInvalidModel()
        {
            _controller.ModelState.AddModelError("Email", "Required");

            var result = await _controller.Register(new RegisterModel());
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Theory]
        [InlineData("Admin")]
        public async Task Register_ReturnsBadRequest_WhenInvalidRole(string role)
        {
            var model = new RegisterModel { Email = "test@test.com", Password = "Pass123!", Role = role };
            var result = await _controller.Register(model);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid role. Choose either 'User' or 'Provider'.", badRequest.Value);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_IfEmailExists()
        {
            _userManagerMock.Setup(um => um.FindByEmailAsync("existing@test.com"))
                .ReturnsAsync(new User());

            var model = new RegisterModel
            {
                Email = "existing@test.com",
                Password = "Pass123!",
                Role = "User"
            };

            var result = await _controller.Register(model);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Email is already in use", badRequest.Value.ToString());
        }

        [Fact]
        public async Task Register_Succeeds()
        {
            var model = new RegisterModel
            {
                Email = "new@test.com",
                Password = "Pass123!",
                UserName = "newuser",
                Role = "User",
                Location = "Nowhere"
            };

            _userManagerMock.Setup(um => um.FindByEmailAsync(model.Email)).ReturnsAsync((User)null);
            _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<User>(), model.Password))
                            .ReturnsAsync(IdentityResult.Success);
            _roleManagerMock.Setup(rm => rm.RoleExistsAsync("User")).ReturnsAsync(false);
            _roleManagerMock.Setup(rm => rm.CreateAsync(It.IsAny<IdentityRole>())).ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(um => um.AddToRoleAsync(It.IsAny<User>(), "User"))
                            .ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(um => um.GetRolesAsync(It.IsAny<User>()))
                            .ReturnsAsync(new List<string> { "User" });

            var result = await _controller.Register(model);
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Token", ok.Value.ToString());
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenUserNotFound()
        {
            _userManagerMock.Setup(um => um.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync((User)null);
            _userManagerMock.Setup(um => um.FindByNameAsync(It.IsAny<string>())).ReturnsAsync((User)null);

            var model = new LoginModel { UserNameOrEmail = "missing@test.com", Password = "Wrong" };
            var result = await _controller.Login(model);

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Contains("Invalid username or email", unauthorized.Value.ToString());
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenPasswordIncorrect()
        {
            var user = new User { Email = "john@test.com", UserName = "john" };
            _userManagerMock.Setup(um => um.FindByEmailAsync(user.Email)).ReturnsAsync(user);
            _signInManagerMock.Setup(sm => sm.PasswordSignInAsync(user, "WrongPassword", false, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            var model = new LoginModel { UserNameOrEmail = user.Email, Password = "WrongPassword" };
            var result = await _controller.Login(model);

            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_Succeeds()
        {
            var user = new User { Id = "1", Email = "test@test.com", UserName = "testuser", Location = "Earth" };

            _userManagerMock.Setup(um => um.FindByEmailAsync(user.Email)).ReturnsAsync(user);
            _signInManagerMock.Setup(sm => sm.PasswordSignInAsync(user, "correct", false, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);
            _userManagerMock.Setup(um => um.GetRolesAsync(user))
                            .ReturnsAsync(new List<string> { "User" });

            var result = await _controller.Login(new LoginModel
            {
                UserNameOrEmail = user.Email,
                Password = "correct"
            });

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Login successful", ok.Value.ToString());
        }

        [Fact]
        public async Task Logout_ReturnsSuccess()
        {
            _signInManagerMock.Setup(sm => sm.SignOutAsync()).Returns(Task.CompletedTask);

            var result = await _controller.Logout();
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Logout successful", ok.Value.ToString());
        }
    }
}
