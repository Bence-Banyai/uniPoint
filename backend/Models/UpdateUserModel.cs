namespace uniPoint_backend.Models
{
    public class UpdateUserModel
    {
        public string? userName { get; set; }
        public string? email { get; set; }
        public string? location { get; set; }
        public bool? isPushNotificationsEnabled { get; set; }
        public string? userSelectedLanguage { get; set; }
    }
}
