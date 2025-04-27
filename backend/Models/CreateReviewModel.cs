namespace uniPoint_backend.Models
{
    public class CreateReviewModel
    {
        public int ServiceId { get; set; }
        public int Score { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}