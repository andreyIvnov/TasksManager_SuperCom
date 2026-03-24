using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class UserDtos
    {
        public class UserMinDataDto
        {
            public int Id { get; set; }
            public string FullName { get; set; }
            public string Telephone { get; set; }
            public string Email { get; set; }
        }
    }
}
