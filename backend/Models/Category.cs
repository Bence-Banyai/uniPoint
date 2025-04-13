using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace uniPoint_backend.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        public string IconUrl { get; set; } = "https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg";
    }
}
