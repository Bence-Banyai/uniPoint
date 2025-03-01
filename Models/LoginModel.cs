using System.ComponentModel.DataAnnotations;

namespace uniPoint_backend.Models
{
    public class LoginModel
    {
        [Required]
        public string UserNameOrEmail { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
