using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Interfaces;
using server.Models;
using System.Net;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : Controller, ITaskRepository
    {
        public CustomResponse<string> AddTagsToTask(int taskId, [FromBody] TaskDtos.TaskAddTagsDto tagsToAdd)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<TaskDtos.TaskMaxDataToShowDto> Create([FromBody] TaskDtos.TaskCreateDto newTaskData)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<string> Delete(int taskId)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<string> DeleteTagsFromTask(int taskId, [FromBody] TaskDtos.TaskDeleteTags tagsToDelete)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<List<TaskDtos.TaskMaxDataToShowDto>> GetAll()
        {
            throw new NotImplementedException();
        }

        public CustomResponse<TaskDtos.TaskMaxDataToShowDto> GetById(int taskId)
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
                Data = "Tasks: I'm Alive!"
            };
        }

        public CustomResponse<string> Update(int taskId, [FromBody] TaskDtos.TaskUpdateDto dataToUpd)
        {
            throw new NotImplementedException();
        }
    }
}
