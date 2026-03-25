using Microsoft.AspNetCore.Mvc;
using server.Models;
using static server.DTOs.TaskDtos;

namespace server.Interfaces
{
    public interface ITaskRepository
    {
        public CustomResponse<List<TaskMaxDataToShowDto>> GetAll();
        public CustomResponse<TaskMaxDataToShowDto> GetById(int taskId);
        public CustomResponse<TaskMaxDataToShowDto> Create([FromBody] TaskCreateDto newTaskData);
        public CustomResponse<string> Update(int taskId, [FromBody] TaskUpdateDto dataToUpd);
        public CustomResponse<string> Delete(int taskId);
        public CustomResponse<string> AssociateTagsToTask(int taskId, [FromBody] TaskAddTagsDto tagsToAssociate);
        public CustomResponse<string> DisassociateTagsFromTask(int taskId, [FromBody] TaskDeleteTags tagsToDisassociate);
    }
}
