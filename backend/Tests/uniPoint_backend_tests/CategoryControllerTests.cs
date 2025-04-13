using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

namespace uniPoint_backend_tests
{
    public class CategoryControllerTests
    {
        private readonly CategoryController _controller;
        private readonly uniPointContext _context;
        private readonly Mock<BlobService> _blobServiceMock;

        public CategoryControllerTests()
        {
            var options = new DbContextOptionsBuilder<uniPointContext>()
                .UseInMemoryDatabase(databaseName: "TestCategoryDb_" + System.Guid.NewGuid())
                .Options;

            _context = new uniPointContext(options);
            _blobServiceMock = new Mock<BlobService>();

            SeedDatabase();

            _controller = new CategoryController(_context, _blobServiceMock.Object);

            var adminUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin1"),
                new Claim(ClaimTypes.Role, "Admin"),
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = adminUser }
            };
        }

        private void SeedDatabase()
        {
            _context.Categories.Add(new Category { CategoryId = 1, Name = "Test Category", IconUrl = "http://example.com/icon.png" });
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetCategories_ReturnsList()
        {
            var result = await _controller.GetCategories();
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Category>>>(result);
            var categories = Assert.IsAssignableFrom<IEnumerable<Category>>(actionResult.Value);
            Assert.Single(categories);
        }

        [Fact]
        public async Task GetCategory_ReturnsCategory_WhenExists()
        {
            var result = await _controller.GetCategory(1);
            var category = Assert.IsType<Category>(result.Value);
            Assert.Equal(1, category.CategoryId);
        }

        [Fact]
        public async Task GetCategory_ReturnsNotFound_WhenNotExists()
        {
            var result = await _controller.GetCategory(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PostCategory_CreatesCategory()
        {
            var newCategory = new Category { Name = "New Category", IconUrl = "iconurl" };
            var result = await _controller.PostCategory(newCategory);

            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var category = Assert.IsType<Category>(created.Value);
            Assert.Equal("New Category", category.Name);
        }

        [Fact]
        public async Task PutCategory_UpdatesCategory_WhenValid()
        {
            var existing = await _context.Categories.FindAsync(1);
            existing.Name = "Updated Name";

            var result = await _controller.PutCategory(1, existing);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PutCategory_ReturnsBadRequest_IfIdMismatch()
        {
            var category = new Category { CategoryId = 2, Name = "Invalid" };
            var result = await _controller.PutCategory(1, category);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PutCategory_ReturnsNotFound_IfCategoryMissing()
        {
            var category = new Category { CategoryId = 99, Name = "Doesn't exist" };
            var result = await _controller.PutCategory(99, category);

            // SaveChanges throws if entity doesn't exist due to concurrency
            // Test catches and confirms NotFound
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteCategory_RemovesCategory()
        {
            var result = await _controller.DeleteCategory(1);
            Assert.IsType<NoContentResult>(result);

            var deleted = await _context.Categories.FindAsync(1);
            Assert.Null(deleted);
        }

        [Fact]
        public async Task DeleteCategory_ReturnsNotFound_WhenInvalidId()
        {
            var result = await _controller.DeleteCategory(1234);
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task UploadCategoryIcon_ReturnsBadRequest_WhenFileIsNull()
        {
            var result = await _controller.UploadCategoryIcon("1", null);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task UploadCategoryIcon_ReturnsBadRequest_WhenInvalidExtension()
        {
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(_ => _.FileName).Returns("icon.txt");

            var result = await _controller.UploadCategoryIcon("1", fileMock.Object);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Unsupported filetype", badRequest.Value.ToString());
        }

        [Fact]
        public async Task UploadCategoryIcon_ReturnsBadRequest_WhenFileTooLarge()
        {
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(_ => _.FileName).Returns("icon.jpg");
            fileMock.Setup(_ => _.Length).Returns(20 * 1024 * 1024); // 20MB

            var result = await _controller.UploadCategoryIcon("1", fileMock.Object);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("under 15MB", badRequest.Value.ToString());
        }
    }
}
