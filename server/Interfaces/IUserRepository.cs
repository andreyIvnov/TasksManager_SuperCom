using Microsoft.AspNetCore.Mvc;
using server.Models;
using static server.DTOs.UserDtos;

namespace server.Interfaces
{
    public interface IUserRepository
    {
        public CustomResponse<List<UserMaxDataDto>> GetAll();
        public CustomResponse<UserMaxDataDto> GetById(int userId);
        public CustomResponse<UserMaxDataDto> Create([FromBody] UserCreateDto newUserData);
        public CustomResponse<string> Update(int userId, [FromBody] UserUpdateDto dataToUpd);
        public CustomResponse<string> Delete(int userId);
        public CustomResponse<string> AssociateTasksToUser(int userId, [FromBody] UserAddTasksDto associatedTasks);
        public CustomResponse<string> DisassociateTasksFromUser(int userId, [FromBody] UserDeleteTasksDto disassociatedTasks);
    }
}
