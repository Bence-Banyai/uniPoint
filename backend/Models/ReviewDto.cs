using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace uniPoint_backend.Models
{
    public class ReviewDto
    {
        public int ReviewId { get; set; }

        public string UserId { get; set; }
        public virtual UserDto? Reviewer { get; set; }

        public ServiceDto? Service { get; set; }
        public int ServiceId { get; set; }

        public int Score { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
