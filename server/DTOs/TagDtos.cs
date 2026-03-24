using server.Models;
using System.ComponentModel.DataAnnotations;

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

        public class TagMinDataDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
    }
}
