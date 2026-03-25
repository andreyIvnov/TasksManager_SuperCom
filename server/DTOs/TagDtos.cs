using server.Models;
using System.ComponentModel.DataAnnotations;
using static server.DTOs.TaskDtos;

namespace server.DTOs
{
    public class TagDtos
    {
        public class TagCreateDto
        {
            [Required]
            public string Name { get; set; }
            public List<int>? Tasks { get; set; } = new List<int>();
        }

        public class TagUpdateDto
        {
            public string? Name { get; set; }
            public List<int>? Tasks { get; set; } = new List<int>();
        }

        public class TagAddTasksDto
        {
            [Required]
            public List<int> TaskIds { get; set; } = new List<int>();
        }

        public class TagDeleteTasksDto
        {
            [Required]
            public List<int> TaskIds { get; set; } = new List<int>();
        }

        public class TagMinDataDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        public class TagMaxDataDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public List<TaskMinDataDto>? Tasks { get; set; }
        }
    }
}
