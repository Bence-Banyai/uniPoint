using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uniPoint_backend.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer; //experimenting

namespace uniPoint_backend.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] //experimenting
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly uniPointContext _uniPointContext;
        private readonly IMapper _mapper;

        public ReviewController(uniPointContext uniPointContext, IMapper mapper)
        {
            _uniPointContext = uniPointContext;
            _mapper = mapper;
        }

        // GET: api/<ReviewController>
        [HttpGet]
        public async Task<IActionResult> GetReviews()
        {
            var reviews = await _uniPointContext.Reviews
                                                .Include(r => r.Reviewer)
                                                .Include(r => r.Service)
                                                .Include(r => r.Service.Provider)
                                                .Include(r => r.Service.Category)
                                                .ToListAsync();

            var dto = _mapper.Map<List<ReviewDto>>(reviews);
            return Ok(dto);
        }

        // GET api/<ReviewController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReview(int id)
        {
            var review = await _uniPointContext.Reviews
                                               .Include(r => r.Reviewer)
                                               .Include(r => r.Service)
                                               .Include(r => r.Service.Provider)
                                               .Include(r => r.Service.Category)
                                               .FirstOrDefaultAsync(r => r.ReviewId == id);

            if (review == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<ReviewDto>(review);
            return Ok(dto);
        }

        // POST api/<ReviewController>
        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var review = new Review
            {
                UserId = userId,
                ServiceId = model.ServiceId,
                Score = model.Score,
                Description = model.Description,
                CreatedAt = model.CreatedAt ?? DateTime.UtcNow
            };

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