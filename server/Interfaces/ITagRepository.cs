using Microsoft.AspNetCore.Mvc;
using server.Models;
using static server.DTOs.TagDtos;

namespace server.Interfaces
{
    public interface ITagRepository
    {
        public CustomResponse<List<Tag>> GetAll();
        public CustomResponse<Tag> GetById(int tagId);
        public CustomResponse<Tag> Create([FromBody] TagCreateDto newTagData);
        public CustomResponse<string> Update(int tagId, [FromBody] TagUpdateDto dataToUpd);
        public CustomResponse<string> Delete(int tagId);
        public CustomResponse<string> AddTasksToTag(int tagId, [FromBody] TagAddTasksDto tasksToAdd);
        public CustomResponse<string> DeleteTasksFromTag(int tagId, [FromBody] TagDeleteTasksDto tasksToDelete);

    }
}
