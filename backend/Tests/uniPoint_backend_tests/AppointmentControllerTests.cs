using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;
using uniPoint_backend.Controllers;
using uniPoint_backend.Models;
using Xunit;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using uniPoint_backend;
using AutoMapper;

namespace uniPoint_backend_tests
{
    public class AppointmentControllerTests
    {
        private readonly AppointmentController _controller;
        private readonly uniPointContext _context;
        private readonly IMapper _mapper;
        private int _openAppointmentId;
        private int _openAppointment2Id;

        public AppointmentControllerTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });

            _mapper = config.CreateMapper();

            var options = new DbContextOptionsBuilder<uniPointContext>()
                .UseInMemoryDatabase(databaseName: "TestAppointmentDb_" + System.Guid.NewGuid())
                .Options;

            _context = new uniPointContext(options);
            SeedDatabase();

            _controller = new AppointmentController(_context, _mapper);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "user1"),
                new Claim(ClaimTypes.Role, "User"),
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        private void SeedDatabase()
        {
            var service = new Service { ServiceName = "Test Service", UserId = "provider1", Address = "address1", Description = "description1" };
            _context.Services.Add(service);
            _context.SaveChanges();

            var appointment = new Appointment
            {
                Id = 1,
                ServiceId = service.ServiceId,
                UserId = "1",
                appointmentDate = DateTime.Now,
                Status = AppointmentStatus.OPEN
            };

            var appointment2 = new Appointment
            {
                Id = 2,
                ServiceId = service.ServiceId,
                UserId = "1",
                appointmentDate = DateTime.Now,
                Status = AppointmentStatus.OPEN
            };

            _context.Appointments.Add(appointment);
            _context.Appointments.Add(appointment2);
            _context.SaveChanges();


            _openAppointmentId = appointment.Id;
            _openAppointment2Id = appointment2.Id;
        }

        [Fact]
        public async Task GetAppointment_ReturnsNotFound_WhenInvalidId()
        {
            var result = await _controller.GetAppointment(999);
            Assert.IsType<NotFoundResult>(result);
        }


        [Fact]
        public async Task BookAppointment_ReturnsOk_WhenAppointmentIsOpen()
        {
            var result = await _controller.BookAppointment(_openAppointmentId);
            var ok = Assert.IsType<OkObjectResult>(result);
            var value = ok.Value.ToString();
            Assert.Contains("Appointment booked successfully", value);
        }

        [Fact]
        public async Task BookAppointment_ReturnsBadRequest_WhenAppointmentNotOpen()
        {
            var appt = await _context.Appointments.FindAsync(_openAppointmentId);
            appt.Status = AppointmentStatus.SCHEDULED;
            await _context.SaveChangesAsync();

            var result = await _controller.BookAppointment(_openAppointmentId);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Appointment is not available for booking.", badRequest.Value);
        }

        [Fact]
        public async Task CancelAppointment_ReturnsForbid_IfNotOwner()
        {
            var appt = await _context.Appointments.FindAsync(_openAppointmentId);
            appt.UserId = "someone-else";
            await _context.SaveChangesAsync();

            var result = await _controller.CancelAppointment(_openAppointmentId);
            Assert.IsType<ForbidResult>(result);
        }

        [Fact]
        public async Task CancelAppointment_ReturnsOk_IfUserOwnsAppointment()
        {
            var appt = await _context.Appointments.FindAsync(_openAppointmentId);
            appt.UserId = "user1";
            await _context.SaveChangesAsync();

            var result = await _controller.CancelAppointment(_openAppointmentId);
            var ok = Assert.IsType<OkObjectResult>(result);
            var msg = ok.Value.ToString();
            Assert.Contains("cancelled", msg);
        }

        [Fact]
        public async Task CreateAppointment_ReturnsCreatedAtAction_WhenValid()
        {
            var service = _context.Services.First();
            var controller = SetupAsProvider("provider1");

            var appointment = new Appointment
            {
                ServiceId = service.ServiceId,
                appointmentDate = System.DateTime.UtcNow.AddDays(2)
            };

            var result = await controller.CreateAppointment(appointment);
            var created = Assert.IsType<CreatedAtActionResult>(result);
            var value = Assert.IsType<Appointment>(created.Value);
            Assert.Equal(AppointmentStatus.OPEN, value.Status);
        }

        [Fact]
        public async Task DeleteAppointment_ReturnsOk_WhenProviderOwnsService()
        {
            var appt = _context.Appointments.First();
            var controller = SetupAsProvider("provider1");

            var result = await controller.DeleteAppointment(appt.Id);
            var ok = Assert.IsType<OkObjectResult>(result);
            var msg = ok.Value.ToString();
            Assert.Contains("deleted", msg);
        }

        private AppointmentController SetupAsProvider(string providerId)
        {
            var provider = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, providerId),
                new Claim(ClaimTypes.Role, "Provider"),
            }, "mock"));

            var controller = new AppointmentController(_context, _mapper);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = provider }
            };

            return controller;
        }
    }
}
