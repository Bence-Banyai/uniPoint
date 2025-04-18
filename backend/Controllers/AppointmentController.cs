using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uniPoint_backend.Models;
using AutoMapper;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace uniPoint_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AppointmentController : ControllerBase
    {
        private readonly uniPointContext _uniPointContext;
        private readonly IMapper _mapper;

        public AppointmentController(uniPointContext uniPointContext, IMapper mapper)
        {
            _uniPointContext = uniPointContext;
            _mapper = mapper;
        }

        // GET: api/<AppointmentController>/open
        [HttpGet("open")]
        public async Task<IActionResult> GetOpenAppointments()
        {
            var openAppointments = await _uniPointContext.Appointments
                                                         .Where(a => a.Status == AppointmentStatus.OPEN)
                                                         .Include(a => a.Booker)
                                                         .Include(a => a.Service)
                                                         .ThenInclude(s => s.Provider)
                                                         .Include(s => s.Service.Category)
                                                         .ToListAsync();

            var dto = _mapper.Map<List<AppointmentDto>>(openAppointments);
            return Ok(dto);
        }

        // GET: api/<AppointmentController>
        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _uniPointContext.Appointments
                                             .Include(a => a.Booker)
                                             .Include(a => a.Service)
                                             .ThenInclude(s => s.Provider)
                                             .Include(s => s.Service.Category)
                                             .ToListAsync();

            var dto = _mapper.Map<List<AppointmentDto>>(appointments);
            return Ok(dto);
        }

        // GET: api/<AppointmentController>
        [HttpGet("myappointments")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            IQueryable<Appointment> query = _uniPointContext.Appointments
                                                             .Include(a => a.Booker)
                                                             .Include(a => a.Service)
                                                             .ThenInclude(s => s.Provider)
                                                             .Include(s => s.Service.Category);

            if (role == "Provider")
            {
                query = query.Where(a => a.Service.UserId == userId);
            }

            if (role == "User")
            {
                query = query.Where(a => a.UserId == userId);
            }

            var appointments = await query.ToListAsync();
            var dto = _mapper.Map<List<AppointmentDto>>(appointments);
            return Ok(dto);
        }

        // GET api/<AppointmentController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var appointment = await _uniPointContext.Appointments
                                        .Include(a => a.Booker)
                                        .Include(a => a.Service)
                                        .ThenInclude(s => s.Provider)
                                        .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<AppointmentDto>(appointment);
            return Ok(dto);
        }

        // POST api/<AppointmentController>/book/id
        [Authorize(Roles = "User,Admin")]
        [HttpPost("book/{id}")]
        public async Task<IActionResult> BookAppointment(int id)
        {
            var appointment = await _uniPointContext.Appointments.FindAsync(id);
            if (appointment == null || appointment.Status != AppointmentStatus.OPEN)
            {
                return BadRequest("Appointment is not available for booking.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            appointment.UserId = userId;
            appointment.Status = AppointmentStatus.SCHEDULED;

            await _uniPointContext.SaveChangesAsync();
            return Ok(new { Message = "Appointment booked successfully!", appointment });
        }

        // PUT api/<AppointmentController>/cancel/id
        [Authorize(Roles = "User,Provider,Admin")]
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var appointment = await _uniPointContext.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (role == "User" && appointment.UserId != userId)
            {
                return Forbid();
            }

            if (role == "Provider")
            {
                var service = await _uniPointContext.Services.FindAsync(appointment.ServiceId);
                if (service == null || service.UserId != userId)
                {
                    return Forbid();
                }
                appointment.Status = AppointmentStatus.CANCELLED_BY_SERVICE;
            }
            else
            {
                appointment.Status = AppointmentStatus.CANCELLED_BY_USER;
            }

            await _uniPointContext.SaveChangesAsync();
            return Ok(new { Message = "Appointment cancelled successfully!", appointment });
        }


        // POST api/<AppointmentController>
        [Authorize(Roles = "Provider,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment appointment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var providerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var service = await _uniPointContext.Services.FindAsync(appointment.ServiceId);
            if (service == null || (User.IsInRole("Provider") && service.UserId != providerId))
            {
                return Forbid();
            }

            appointment.Status = AppointmentStatus.OPEN;

            _uniPointContext.Appointments.Add(appointment);
            await _uniPointContext.SaveChangesAsync();
            return CreatedAtAction("GetAppointment", new { id = appointment.Id }, appointment);
        }

        // PUT api/<AppointmentController>/5
        [Authorize(Roles = "Provider,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] Appointment updatedAppointment)
        {
            if (id != updatedAppointment.Id)
            {
                return BadRequest("Appointment ID does not match.");
            }

            var appointment = await _uniPointContext.Appointments
                                                    .Include(a => a.Service)
                                                    .ThenInclude(s => s.Provider)
                                                    .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound();
            }

            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (role == "Provider" && appointment.Service.UserId != userId)
            {
                return Forbid();
            }

            appointment.appointmentDate = updatedAppointment.appointmentDate;
            appointment.Status = updatedAppointment.Status;

            _uniPointContext.Entry(appointment).State = EntityState.Modified;
            await _uniPointContext.SaveChangesAsync();

            return Ok(new { Message = "Appointment updated successfully!", appointment });
        }

        // DELETE api/<AppointmentController>/5
        [Authorize(Roles = "Provider,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _uniPointContext.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (role == "Provider")
            {
                var service = await _uniPointContext.Services.FindAsync(appointment.ServiceId);
                if (service == null || service.UserId != userId)
                {
                    return Forbid();
                }
            }

            _uniPointContext.Appointments.Remove(appointment);
            await _uniPointContext.SaveChangesAsync();
            return Ok(new { Message = "Appointment deleted successfully!" });
        }
    }
}