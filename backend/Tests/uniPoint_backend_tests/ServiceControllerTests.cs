using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using uniPoint_backend.Controllers;
using uniPoint_backend.Models;
using uniPoint_backend;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Xunit;
using AutoMapper;

namespace uniPoint_backend_tests
{
    public class ServiceControllerTests
    {
        private readonly ServiceController _controller;
        private readonly Mock<BlobService> _mockBlobService;
        private readonly uniPointContext _context;
        private readonly IMapper _mapper;
        private int _service1Id;
        private int _service2Id;

        public ServiceControllerTests()
        {
            // In-memory database setup
            var options = new DbContextOptionsBuilder<uniPointContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new uniPointContext(options);

            // Seed database with mock data if needed
            SeedDatabase();

            _mockBlobService = new Mock<BlobService>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });

            _mapper = config.CreateMapper();

            _controller = new ServiceController(_context, _mockBlobService.Object, _mapper);

            // Mock authentication
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
            new Claim(ClaimTypes.NameIdentifier, "1"),
            new Claim(ClaimTypes.Role, "Provider"),
            }, "mock"));

            // Assign the user to the controller's HttpContext
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };
        }

        // Seed mock data
        private void SeedDatabase()
        {
            var service1 = new Service { ServiceName = "Test Service 1", Price = 100, Address = "asdf", Description = "asdfadfs", UserId = "1" };
            var service2 = new Service { ServiceName = "Test Service 2", Price = 200, Address = "ljkljk", Description = "ljklj", UserId = "dssadf" };

            _context.Services.AddRange(service1, service2);
            _context.SaveChanges();

            var seededService1 = _context.Services.FirstOrDefault(s => s.ServiceName == "Test Service 1");
            var seededService2 = _context.Services.FirstOrDefault(s => s.ServiceName == "Test Service 2");

            // Store the generated IDs for later use in tests
            _service1Id = seededService1?.ServiceId ?? 0;
            _service2Id = seededService2?.ServiceId ?? 0;
        }

        [Fact]
        public async Task GetServices_ReturnsOkResult_WithListOfServices()
        {
            // Act
            var result = await _controller.GetServices();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetService_ReturnsNotFound_WhenServiceDoesNotExist()
        {
            // Act
            var result = await _controller.GetService(99); // Non-existing ID

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateService_ReturnsCreatedAtAction_WhenValidService()
        {
            // Arrange
            var newService = new Service
            {
                ServiceName = "New Service",
                Price = 300,
                Description = "Test Description",
                Address = "dfadfa"
            };

            // Act
            var result = await _controller.CreateService(newService);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<Service>(createdAtActionResult.Value);
            Assert.Equal("New Service", returnValue.ServiceName);
        }

        [Fact]
        public async Task UpdateService_ReturnsOkResult_WhenValidService()
        {
            // Arrange
            var existingService = await _context.Services.FindAsync(1);
            existingService.ServiceName = "Updated Service";

            // Act
            var result = await _controller.UpdateService(_service1Id, existingService);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedService = Assert.IsType<Service>(okResult.Value);
            Assert.Equal("Updated Service", updatedService.ServiceName);
        }

        [Fact]
        public async Task DeleteService_ReturnsOkResult_WhenServiceExists()
        {
            // Act
            var result = await _controller.DeleteService(_service1Id);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task UploadServicePicture_ReturnsBadRequest_WhenNoFilesProvided()
        {
            // Act
            var result = await _controller.UploadServicePicture(_service1Id, null);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }
    }
}