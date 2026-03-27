namespace server.DTOs
{
    public class TaskReminderDtos
    {
        // DTO for reminder messages
        public class TaskReminder
        {
            public int TaskId { get; set; }
            public string TaskTitle { get; set; } = string.Empty;
            public DateTime DueDate { get; set; }
            public DateTime SentAt { get; set; } = DateTime.UtcNow;
        }
    }
}