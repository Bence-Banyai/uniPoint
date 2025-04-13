using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using uniPoint_backend;
using uniPoint_backend.Controllers;
using uniPoint_backend.Models;
using Xunit;

namespace uniPoint_backend_tests
{
    public class ReviewControllerTests
    {
        private readonly ReviewController _controller;
        private readonly uniPointContext _context;

        public ReviewControllerTests()
        {
            var options = new DbContextOptionsBuilder<uniPointContext>()
                .UseInMemoryDatabase(databaseName: "TestReviewDb_" + System.Guid.NewGuid())
                .Options;

            _context = new uniPointContext(options);
            SeedDatabase();

            _controller = new ReviewController(_context);
        }

        private void SeedDatabase()
        {
            _context.Users.Add(new User { Id = "user1", UserName = "testuser" });
            _context.Services.Add(new Service { ServiceId = 1, ServiceName = "Test Service", Address = "address", Description = "description", UserId = "1" });

            _context.Reviews.Add(new Review
            {
                ReviewId = 1,
                UserId = "user1",
                Score = 5,
                Description = "Excellent!",
                ServiceId = 1
            });

            _context.SaveChanges();
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
        public async Task GetReviews_ReturnsAllReviews()
        {
            var result = await _controller.GetReviews();
            var ok = Assert.IsType<OkObjectResult>(result);
            var reviews = Assert.IsAssignableFrom<List<Review>>(ok.Value);
            Assert.Single(reviews);
        }

        [Fact]
        public async Task GetReview_ReturnsReview_WhenExists()
        {
            var result = await _controller.GetReview(1);
            var ok = Assert.IsType<OkObjectResult>(result);
            var review = Assert.IsType<Review>(ok.Value);
            Assert.Equal(1, review.ReviewId);
        }

        [Fact]
        public async Task GetReview_ReturnsNotFound_WhenMissing()
        {
            var result = await _controller.GetReview(999);
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateReview_CreatesReview_WhenValid()
        {
            SetUser("user2", "User");

            var newReview = new Review
            {
                Score = 4,
                Description = "Good!",
                ServiceId = 1
            };

            var result = await _controller.CreateReview(newReview);
            var created = Assert.IsType<CreatedAtActionResult>(result);
            var review = Assert.IsType<Review>(created.Value);
            Assert.Equal("user2", review.UserId);
        }

        [Fact]
        public async Task CreateReview_ReturnsBadRequest_WhenModelInvalid()
        {
            SetUser("user2", "User");
            _controller.ModelState.AddModelError("Score", "Required");

            var result = await _controller.CreateReview(new Review());
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task UpdateReview_Succeeds_ForOwner()
        {
            SetUser("user1", "User");

            var update = new Review
            {
                ReviewId = 1,
                Score = 3,
                Description = "Updated"
            };

            var result = await _controller.UpdateReview(1, update);
            var ok = Assert.IsType<OkObjectResult>(result);
            var review = Assert.IsType<Review>(ok.Value);
            Assert.Equal("Updated", review.Description);
        }

        [Fact]
        public async Task UpdateReview_Succeeds_ForAdmin()
        {
            SetUser("admin1", "Admin");

            var update = new Review
            {
                ReviewId = 1,
                Score = 2,
                Description = "Admin Updated"
            };

            var result = await _controller.UpdateReview(1, update);
            var ok = Assert.IsType<OkObjectResult>(result);
            var review = Assert.IsType<Review>(ok.Value);
            Assert.Equal("Admin Updated", review.Description);
        }

        [Fact]
        public async Task UpdateReview_ReturnsForbidden_IfUserNotOwner()
        {
            SetUser("userX", "User");

            var update = new Review
            {
                ReviewId = 1,
                Score = 1,
                Description = "Should not update"
            };

            var result = await _controller.UpdateReview(1, update);
            Assert.IsType<ForbidResult>(result);
        }

        [Fact]
        public async Task UpdateReview_ReturnsNotFound_IfMissing()
        {
            SetUser("admin", "Admin");

            var update = new Review { ReviewId = 99 };
            var result = await _controller.UpdateReview(99, update);
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task UpdateReview_ReturnsBadRequest_IfIdMismatch()
        {
            SetUser("user1", "User");

            var update = new Review { ReviewId = 2 };
            var result = await _controller.UpdateReview(1, update);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Id doesn't match", badRequest.Value.ToString());
        }

        [Fact]
        public async Task DeleteReview_Succeeds_ForOwner()
        {
            SetUser("user1", "User");
            var result = await _controller.DeleteReview(1);
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeleteReview_Succeeds_ForAdmin()
        {
            SetUser("admin", "Admin");

            // Add back a review to delete
            _context.Reviews.Add(new Review
            {
                ReviewId = 2,
                UserId = "userX",
                Score = 2,
                Description = "To delete",
                ServiceId = 1
            });
            _context.SaveChanges();

            var result = await _controller.DeleteReview(2);
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeleteReview_ReturnsNotFound_IfMissing()
        {
            SetUser("admin", "Admin");
            var result = await _controller.DeleteReview(999);
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteReview_ReturnsForbidden_IfUserNotOwner()
        {
            // Add a new review for userY
            _context.Reviews.Add(new Review
            {
                ReviewId = 3,
                UserId = "userY",
                Score = 1,
                Description = "Not yours",
                ServiceId = 1
            });
            _context.SaveChanges();

            SetUser("userZ", "User");
            var result = await _controller.DeleteReview(3);
            Assert.IsType<ForbidResult>(result);
        }
    }
}