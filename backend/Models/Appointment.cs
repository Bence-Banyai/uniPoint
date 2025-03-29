using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace uniPoint_backend.Models
{
    public enum AppointmentStatus
    {
        OPEN,
        SCHEDULED,
        DONE,
        CANCELLED_BY_USER,
        CANCELLED_BY_SERVICE,
    }

    public class Appointment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User? Booker { get; set; }

        [ForeignKey("ServiceId")]
        public Service? Service { get; set; }
        [Required]
        public int ServiceId { get; set; }


        [Required]
        [Timestamp]
        public DateTime appointmentDate { get; set; }

        [Required]
        [EnumDataType(typeof(AppointmentStatus))]
        public AppointmentStatus Status { get; set; } = AppointmentStatus.OPEN;
    }
}
