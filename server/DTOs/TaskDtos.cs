using server.Models;
using System.ComponentModel.DataAnnotations;
using static server.DTOs.TagDtos;
using static server.DTOs.UserDtos;

namespace server.DTOs
{
    public class TaskDtos
    {
        public class TaskCreateDto
        {
            public string Title { get; set; }
            public string? Description { get; set; }
            public DateTime DueDate { get; set; }
            public int Priority { get; set; }
            public int? UserId { get; set; }
            public bool IsReminderSent { get; set; }
        }

        public class TaskUpdateDto
        {
            public string? Title { get; set; }
            public string? Description { get; set; }
            public DateTime? DueDate { get; set; }
            public int? Priority { get; set; }
            public int? UserId { get; set; }
            public bool? IsReminderSent { get; set; }
            public List<int>? TagIds { get; set; }
        }

        public class TaskAddTagsDto
        {
            [Required]
            public List<int> TagIds { get; set; }
        }

        public class TaskRemoveTasks
        {
            [Required]
            public List<int> TagIds { get; set; }
        }

        public class TaskMaxDataToShowDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string? Description { get; set; }
            public DateTime DueDate { get; set; }
            public int Priority { get; set; }
            public bool IsReminderSent { get; set; }
            public UserMinDataDto? User { get; set; }
            public List<TagMinDataDto>? Tags { get; set; } = new List<TagMinDataDto>();
        }
    }
}
