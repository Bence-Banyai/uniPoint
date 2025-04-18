using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace uniPoint_backend.Models
{
    public class AppointmentDto
    {
        public int Id { get; set; }

        public string? UserId { get; set; }
        public virtual UserDto? Booker { get; set; }

        public ServiceDto? Service { get; set; }
        public int ServiceId { get; set; }

        public DateTime appointmentDate { get; set; }

        public AppointmentStatus Status { get; set; }
    }
}
