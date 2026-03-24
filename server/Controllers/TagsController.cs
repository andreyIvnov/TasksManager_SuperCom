using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Interfaces;
using server.Models;
using System.Net;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : Controller, ITagRepository
    {
        public CustomResponse<string> AddTasksToTag(int tagId, [FromBody] TagDtos.TagAddTasksDto tasksToAdd)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<Tag> Create([FromBody] TagDtos.TagCreateDto newTagData)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<string> Delete(int tagId)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<string> DeleteTasksFromTag(int tagId, [FromBody] TagDtos.TagDeleteTasksDto tasksToDelete)
        {
            throw new NotImplementedException();
        }

        public CustomResponse<List<Tag>> GetAll()
        {
            throw new NotImplementedException();
        }

        public CustomResponse<Tag> GetById(int tagId)
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
                Data = "Tags: I'm Alive!"
            };
        }

        public CustomResponse<string> Update(int tagId, [FromBody] TagDtos.TagUpdateDto dataToUpd)
        {
            throw new NotImplementedException();
        }
    }
}
