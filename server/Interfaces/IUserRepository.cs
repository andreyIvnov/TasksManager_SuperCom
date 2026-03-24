using Microsoft.AspNetCore.Mvc;
using server.Models;
using static server.DTOs.UserDtos;

namespace server.Interfaces
{
    public interface IUserRepository
    {
        public CustomResponse<List<User>> GetAll();
        public CustomResponse<User> GetById(int userId);
        public CustomResponse<User> Create([FromBody] UserCreateDto newUserData);
        public CustomResponse<string> Update(int userId, [FromBody] UserUpdateDto dataToUpd);
        public CustomResponse<string> Delete(int userId);
        public CustomResponse<string> AddTasksToUser(int userId, [FromBody] UserAddTasksDto tasksToAdd);
        public CustomResponse<string> DeleteTasksFromUser(int userId, [FromBody] UserDeleteTasksDto tasksToDelete);
    }
}
