using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uniPoint_backend.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace uniPoint_backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly uniPointContext _uniPointContext;

        public ReviewController(uniPointContext uniPointContext)
        {
            _uniPointContext = uniPointContext;
        }

        // GET: api/<ReviewController>
        [HttpGet]
        public async Task<IActionResult> GetReviews()
        {
            var reviews = await _uniPointContext.Reviews
                                                .Include(r => r.Reviewer)
                                                .Include(r => r.Service)
                                                .ToListAsync();
            return Ok(reviews);
        }

        // GET api/<ReviewController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReview(int id)
        {
            var review = await _uniPointContext.Reviews
                                               .Include(r => r.Reviewer)
                                               .Include(r => r.Service)
                                               .FirstOrDefaultAsync(r => r.ReviewId == id);

            if (review == null)
            {
                return NotFound();
            }

            return Ok(review);
        }

        // POST api/<ReviewController>
        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateReview(Review review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            review.UserId = userId;

            _uniPointContext.Reviews.Add(review);
            await _uniPointContext.SaveChangesAsync();
            return CreatedAtAction("GetReview", new { id = review.ReviewId }, review);
        }

        // PUT api/<ReviewController>/5
        [Authorize(Roles = "User,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, Review review)
        {
            if (id != review.ReviewId)
            {
                return BadRequest("Id doesn't match");
            }

            var existingReview = await _uniPointContext.Reviews.FindAsync(id);
            if (existingReview == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && existingReview.UserId != userId)
            {
                return Forbid();
            }

            existingReview.Score = review.Score;
            existingReview.Description = review.Description;
            _uniPointContext.Entry(existingReview).State = EntityState.Modified;
            await _uniPointContext.SaveChangesAsync();
            return Ok(existingReview);
        }

        // DELETE api/<ReviewController>/5
        [Authorize(Roles = "User,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _uniPointContext.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && review.UserId != userId)
            {
                return Forbid();
            }

            _uniPointContext.Reviews.Remove(review);
            await _uniPointContext.SaveChangesAsync();
            return Ok();
        }
    }
}