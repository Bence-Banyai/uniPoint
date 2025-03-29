using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uniPoint_backend.Models
{
    public class User : IdentityUser
    {
        [MaxLength(255)]
        public string ProfilePictureUrl { get; set; } = "default.png";

        [MaxLength(255)]
        public string? Location { get; set; }

        public bool IsPushNotificationsEnabled { get; set; } = false;

        public string? UserSelectedLanguage { get; set; } = "magyar"; // magyar vagy angol

        [Required]
        [Timestamp]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
