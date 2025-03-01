using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using uniPoint_backend.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace uniPoint_backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly uniPointContext _uniPointContext;

        public ServiceController(uniPointContext uniPointContext)
        {
            _uniPointContext = uniPointContext;
        }

        // GET: api/<ServiceController>
        [HttpGet]
        public async Task<IActionResult> GetServices()
        {
            var services = await _uniPointContext.Services.Include(s => s.Provider).ToListAsync();
            return Ok(services);
        }

        // GET api/<ServiceController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetService(int id)
        {
            var service = await _uniPointContext.Services.Include(s => s.Provider)
                                                          .FirstOrDefaultAsync(s => s.ServiceId == id);

            if (service == null)
            {
                return NotFound();
            }

            return Ok(service);
        }

        // POST api/<ServiceController>
        [Authorize(Roles = "Provider,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateService(Service service)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var providerId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get current provider ID
            service.UserId = providerId;

            _uniPointContext.Services.Add(service);
            await _uniPointContext.SaveChangesAsync();
            return CreatedAtAction("GetService", new { id = service.ServiceId }, service);
        }

        // PUT api/<ServiceController>/5
        [Authorize(Roles = "Provider,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] Service service)
        {
            if (id != service.ServiceId)
            {
                return BadRequest("Id doesn't match");
            }

            var existingService = await _uniPointContext.Services.FindAsync(id);
            if (existingService == null)
            {
                return NotFound();
            }

            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (role != "Admin" && existingService.UserId != userId)
            {
                return Forbid();
            }

            existingService.ServiceName = service.ServiceName;
            existingService.Price = service.Price;
            existingService.Description = service.Description;
            existingService.Address = service.Address;
            existingService.Duration = service.Duration;

            _uniPointContext.Entry(existingService).State = EntityState.Modified;
            await _uniPointContext.SaveChangesAsync();
            return Ok(existingService);
        }

        // DELETE api/<ServiceController>/5
        [Authorize(Roles = "Provider,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _uniPointContext.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }


            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (role != "Admin" && service.UserId != userId)
            {
                return Forbid();
            }

            _uniPointContext.Services.Remove(service);
            await _uniPointContext.SaveChangesAsync();
            return Ok();
        }
    }
}
