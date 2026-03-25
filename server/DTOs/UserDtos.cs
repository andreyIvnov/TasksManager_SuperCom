using server.Models;
using System.ComponentModel.DataAnnotations;
using static server.DTOs.TaskDtos;

namespace server.DTOs
{
    public class UserDtos
    {
        public class UserCreateDto
        {
            [Required]
            public string? FullName { get; set; }
            [Required]
            public string? Telephone { get; set; }
            [EmailAddress]
            public string? Email { get; set; }
            public List<int>? TaskIds { get; set; } = new List<int>();
        }

        public class UserUpdateDto
        {
            public string? FullName { get; set; }
            public string? Telephone { get; set; }
            [EmailAddress]
            public string? Email { get; set; }
            public List<int>? TaskIds { get; set; } = new List<int>();
        }

        public class UserAddTasksDto
        {
            [Required]
            public List<int> TaskIds { get; set; } = new List<int>();
        }

        public class UserDeleteTasksDto
        {
            [Required]
            public List<int> TaskIds { get; set; } = new List<int>();
        }
        public class UserMinDataDto
        {
            public int Id { get; set; }
            public string FullName { get; set; }
            public string Telephone { get; set; }
            public string? Email { get; set; }
        }
        public class UserMaxDataDto
        {
            public int Id { get; set; }
            public string FullName { get; set; }
            public string Telephone { get; set; }
            public string? Email { get; set; }
            public List<TaskMinDataDto>? Tasks { get; set; }
        }

    }
}
