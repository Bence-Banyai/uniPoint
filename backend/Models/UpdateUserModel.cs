namespace uniPoint_backend.Models
{
    public class UpdateUserModel
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Location { get; set; }
        public bool? IsPushNotificationsEnabled { get; set; }
        public string? UserSelectedLanguage { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }
}