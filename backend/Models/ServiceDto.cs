using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace uniPoint_backend.Models
{
    public class ServiceDto
    {
        public int ServiceId { get; set; }

        public string UserId { get; set; }

        public UserDto? Provider { get; set; }

        public Category? Category { get; set; }
        public int CategoryId { get; set; }

        public string ServiceName { get; set; }

        public int Price { get; set; }

        public string Description { get; set; }

        public string Address { get; set; }

        public int Duration { get; set; }

        public int OpeningHours { get; set; } // todo

        public List<string>? ImageUrls { get; set; }
    }
}
