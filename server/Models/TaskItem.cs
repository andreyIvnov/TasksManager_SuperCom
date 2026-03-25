using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Required]
        public int Priority { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public bool? IsReminderSent { get; set; }
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}
