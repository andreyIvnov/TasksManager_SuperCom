using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Interfaces;
using server.Models;
using System.Net;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller, IUserRepository
    {
        public CustomResponse<string> AddTasksToUser(int userId, [FromBody] UserDtos.UserAddTasksDto tasksToAdd)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<User> Create([FromBody] UserDtos.UserCreateDto newUserData)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<string> Delete(int userId)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<string> DeleteTasksFromUser(int userId, [FromBody] UserDtos.UserDeleteTasksDto tasksToDelete)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<List<User>> GetAll()
        {
            throw new NotImplementedException();
        }

        public CustomResponse<User> GetById(int userId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("Index")]
        public CustomResponse<string> Index()
        {
            return new CustomResponse<string>
            {
                Code = (int)HttpStatusCode.OK,
                Message = HttpStatusCode.OK.ToString(),
                Data = "Users: I'm Alive!"
            };
        }

        public CustomResponse<string> Update(int userId, [FromBody] UserDtos.UserUpdateDto dataToUpd)
        {
            throw new NotImplementedException();
        }
    }
}
