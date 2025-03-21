using System.ComponentModel.DataAnnotations;

namespace uniPoint_backend.Models
{
    public class RegisterModel
    {
        [Required]
        [StringLength(maximumLength: 30, MinimumLength = 1)]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }
    }
}
