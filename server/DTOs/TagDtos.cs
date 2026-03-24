using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class TagDtos
    {
        public class TagMinDataDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
    }
}
