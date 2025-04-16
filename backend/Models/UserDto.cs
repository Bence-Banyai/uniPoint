namespace uniPoint_backend.Models
{
    public class UserDto
    {
        public string userName { get; set; }
        public string email { get; set; }
        public string? location { get; set; }
        public string profilePictureUrl { get; set; }
    }
}
