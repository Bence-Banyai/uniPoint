using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uniPoint_backend.Models
{
    public class Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceId { get; set; }

        [Required]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User? Provider { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(255)]
        public string ServiceName { get; set; }

        [Required]
        [Range(0, 1000000)]
        public int Price { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; }

        [MaxLength(255)]
        public string Address { get; set; }

        public int Duration { get; set; }

        public TimeOnly OpensAt { get; set; }
        public TimeOnly ClosesAt { get; set; }
        
        public List<string>? ImageUrls { get; set; }
    }
}
