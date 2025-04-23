using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uniPoint_backend.Models
{
    public class User : IdentityUser
    {
        [MaxLength(255)]
        public string ProfilePictureUrl { get; set; } = "https://tiszolczijacint.blob.core.windows.net/img/63cf316b-35a1-432e-92fe-0f2d0b2029c3.jpg";

        [MaxLength(255)]
        public string? Location { get; set; }

        public bool IsPushNotificationsEnabled { get; set; } = false;

        public string? UserSelectedLanguage { get; set; } = "magyar"; // magyar vagy angol

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
