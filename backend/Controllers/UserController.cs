using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uniPoint_backend.Models;
using uniPoint_backend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace uniPoint_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly BlobService _blobService;
        private readonly uniPointContext _uniPointContext;
        private readonly IMapper _mapper;


        public UserController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, BlobService blobService, uniPointContext uniPointContext, IMapper mapper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _blobService = blobService;
            _uniPointContext = uniPointContext;
            _mapper = mapper;
        }

        // GET: api/<UserController>
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var dto = _mapper.Map<List<UserDto>>(users);
            return Ok(dto);
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            if (currentUserId != id && !isAdmin)
            {
                return Forbid();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var userInfo = new
            {
                userName = user.UserName,
                email = user.Email,
                location = user.Location,
                role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? "User",
                profilePictureUrl = user.ProfilePictureUrl,
                createdAt = user.CreatedAt
            };

            return Ok(userInfo);
        }

        // POST a register-en keresztul

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserModel model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (id != currentUserId)
            {
                return Forbid();
            }

            user.UserName = model.userName;
            user.Email = model.email;
            user.Location = model.location;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var dto = _mapper.Map<UserDto>(user);
            return Ok(dto);
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (id != currentUserId)
            {
                return Forbid();
            }


            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("User deleted successfully.");
        }

        // POST api/<UserController>/5/upload-profile-picture
        [HttpPost("{id}/upload-profile-picture")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadProfilePicture(string id, IFormFile file)
        {
            if (file == null)
                return BadRequest();

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return BadRequest("Unsupported filetype (must be: jpg, jpeg, png).");

            const long maxFileSize = 15 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                return BadRequest("File size must be under 15MB.");
            }

            string imageUrl = await _blobService.UploadImageAsync(file);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (id != currentUserId)
            {
                return Forbid();
            }

            user.ProfilePictureUrl = imageUrl;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            var dto = _mapper.Map<UserDto>(user);
            return Ok(dto);
        }
    }
}
