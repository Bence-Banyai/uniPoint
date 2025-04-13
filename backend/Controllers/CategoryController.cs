using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using uniPoint_backend.Models;

namespace uniPoint_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly uniPointContext _uniPointContext;
        private readonly BlobService _blobService;

        public CategoryController(uniPointContext uniPointContext, BlobService blobService)
        {
            _uniPointContext = uniPointContext;
            _blobService = blobService;
        }

        // GET: api/Category
        [HttpGet]
        [AllowAnonymous] // Allow anyone to view categories
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _uniPointContext.Categories.ToListAsync();
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        [AllowAnonymous] // Allow anyone to view a single category
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _uniPointContext.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // POST: api/Category
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            _uniPointContext.Categories.Add(category);
            await _uniPointContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, category);
        }

        // PUT: api/Category/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutCategory(int id, Category category)
        {
            if (id != category.CategoryId)
            {
                return BadRequest();
            }

            _uniPointContext.Entry(category).State = EntityState.Modified;

            try
            {
                await _uniPointContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _uniPointContext.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _uniPointContext.Categories.Remove(category);
            await _uniPointContext.SaveChangesAsync();

            return NoContent();
        }

        // POST api/<UserController>/5/upload-profile-picture
        [HttpPost("{id}/upload-categoryicon")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadCategoryIcon(int id, IFormFile file)
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

            var category = await _uniPointContext.Categories.FindAsync(id);

            category.IconUrl = imageUrl;

            _uniPointContext.Entry(category).State = EntityState.Modified;
            await _uniPointContext.SaveChangesAsync();

            return Ok(category);
        }

        private bool CategoryExists(int id)
        {
            return _uniPointContext.Categories.Any(e => e.CategoryId == id);
        }
    }
}
