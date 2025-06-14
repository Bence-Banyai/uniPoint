﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using uniPoint_backend.Models;

namespace uniPoint_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly uniPointContext _uniPointContext;
        private readonly BlobService _blobService;
        private readonly IMapper _mapper;


        public ServiceController(uniPointContext uniPointContext, BlobService blobService, IMapper mapper)
        {
            _uniPointContext = uniPointContext;
            _blobService = blobService;
            _mapper = mapper;
        }

        // GET: api/<ServiceController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetServices()
        {
            var services = await _uniPointContext.Services
                .Include(s => s.Provider)
                .Include(s => s.Category)
                .ToListAsync();

            var dto = _mapper.Map<List<ServiceDto>>(services);
            return Ok(dto);
        }

        // GET api/<ServiceController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetService(int id)
        {
            var service = await _uniPointContext.Services
                .Include(s => s.Provider)
                .Include(s => s.Category)
                .FirstOrDefaultAsync(s => s.ServiceId == id);

            if (service == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<ServiceDto>(service);
            return Ok(dto);
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

            var providerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
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
            existingService.OpensAt = service.OpensAt;
            existingService.ClosesAt = service.ClosesAt;

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

        // POST api/<ServiceController>/5/upload-service-picture
        [Authorize(Roles = "Provider,Admin")]
        [Consumes("multipart/form-data")]
        [HttpPost("{id}/upload-service-picture")]
        public async Task<IActionResult> UploadServicePicture(int id, IFormFileCollection files)
        {
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

            if (files == null)
                return BadRequest();

            if (files.Count > 10)
                return BadRequest("Max number of images: 10");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            List<string> imageUrls = new List<string>();
            foreach (var file in files)
            {
                var extension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Unsupported filetype (must be: jpg, jpeg, png).");

                const long maxFileSize = 15 * 1024 * 1024;

                if (file.Length > maxFileSize)
                {
                    return BadRequest("File size must be under 15MB.");
                }

                string imageUrl = await _blobService.UploadImageAsync(file);
                imageUrls.Add(imageUrl);
            }

            existingService.ImageUrls = imageUrls;

            _uniPointContext.Entry(existingService).State = EntityState.Modified;
            await _uniPointContext.SaveChangesAsync();

            return Ok(existingService);
        }
    }
}
