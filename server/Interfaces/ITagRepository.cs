using Microsoft.AspNetCore.Mvc;
using server.Models;
using static server.DTOs.TagDtos;

namespace server.Interfaces
{
    public interface ITagRepository
    {
        public CustomResponse<List<TagMaxDataDto>> GetAll();
        public CustomResponse<TagMaxDataDto> GetById(int tagId);
        public CustomResponse<TagMaxDataDto> Create([FromBody] TagCreateDto newTagData);
        public CustomResponse<string> Update(int tagId, [FromBody] TagUpdateDto dataToUpd);
        public CustomResponse<string> Delete(int tagId);
        public CustomResponse<string> AssociateTasksToTag(int tagId, [FromBody] TagAddTasksDto tasksToAdd);
        public CustomResponse<string> DisassociateTasksFromTag(int tagId, [FromBody] TagDeleteTasksDto tasksToDelete);

    }
}
