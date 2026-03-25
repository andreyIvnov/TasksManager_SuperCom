using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTOs;
using server.Interfaces;
using server.Models;
using server.Queries;
using System.Net;
using System.Text;
using static server.DTOs.TagDtos;
using static server.DTOs.TaskDtos;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : Controller, ITagRepository
    {
        private readonly ILogger<TagsController> _logger;
        private readonly AppDbContext _ctx;
        public TagsController(AppDbContext context, ILogger<TagsController> logger)
        {
            _ctx = context;
            _logger = logger;
        }

        [HttpPost]
        public CustomResponse<TagMaxDataDto> Create([FromBody] TagCreateDto newTagData)
        {
            CustomResponse<TagMaxDataDto> res = new CustomResponse<TagMaxDataDto>();
            try
            {
                bool notExistedTasks = false;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tasks with Id: ");

                Tag tagToCreate = new Tag();
                if (!string.IsNullOrEmpty(newTagData.Name))
                {
                    tagToCreate.Name = newTagData.Name;
                }
                if (newTagData.Tasks != null && newTagData.Tasks.Count > 0)
                {
                    for (int i = 0; i < newTagData.Tasks.Count; i ++)
                    {
                        TaskItem? existedTask = TasksQ.GetTaskById(_ctx, newTagData.Tasks[i]);
                        if (existedTask != null)
                        {
                            tagToCreate.Tasks.Add(existedTask);
                        }
                        else
                        {
                            notExistedTasks = true;
                            sb.Append(newTagData.Tasks[i] + "; ");
                        }
                    }
                }

                _ctx.Tags.Add(tagToCreate);
                _ctx.SaveChanges();

                res.Code = (int)HttpStatusCode.Created;
                res.Message = HttpStatusCode.Created.ToString() + ". " + (notExistedTasks == true ? sb.ToString() : string.Empty);
                res.Data = new TagMaxDataDto
                {
                    Id = tagToCreate.Id,
                    Name = tagToCreate.Name,
                    Tasks = tagToCreate.Tasks.Count > 0 ? tagToCreate.Tasks.Select(task => new TaskMinDataDto
                    {
                        Id = task.Id,
                        Title = task.Title,
                        Priority = task.Priority,
                        DueDate = task.DueDate
                    }).ToList() : null
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on create Tag\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpPut("associatetasks/{tagId}")]
        public CustomResponse<string> AssociateTasksToTag(int tagId, [FromBody] TagAddTasksDto tasksToAdd)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                bool notExistedTasks = false;
                int countOfUpdates = 0;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tasks to add with Id: ");

                Tag? existedTag = TagsQ.GetTagById(_ctx, tagId);
                if (existedTag != null)
                {
                    if (tasksToAdd.TaskIds != null && tasksToAdd.TaskIds.Count > 0)
                    {
                        for (int i = 0; i < tasksToAdd.TaskIds.Count; i++)
                        {
                            TaskItem? existedTask = TasksQ.GetTaskById(_ctx, tasksToAdd.TaskIds[i]);
                            if (existedTask != null)
                            {
                                existedTag.Tasks.Add(existedTask);
                                countOfUpdates++;
                            }
                            else
                            {
                                notExistedTasks = true;
                                sb.Append(tasksToAdd.TaskIds[i] + "; ");
                            }
                        }

                        if (countOfUpdates > 0)
                        {
                            _ctx.Tags.Update(existedTag);
                            _ctx.SaveChanges();
                            res.Data = $"Tasks was Added to Tag '{tagId}'. ";
                        }
                        else
                        {
                            res.Data = "There is no correct data to Add. ";
                        }

                        res.Code = (int)HttpStatusCode.OK;
                        res.Message = HttpStatusCode.OK.ToString();
                        res.Data += notExistedTasks == true ? sb.ToString() : string.Empty;
                    }
                    else
                    {
                        res.Code = (int)HttpStatusCode.BadRequest;
                        res.Message = HttpStatusCode.BadRequest.ToString();
                        res.Data = "Tasks list is empty";
                    }
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no Tag with Id: '{tagId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on AddTasksToTag\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpDelete("{tagId}")]
        public CustomResponse<string> Delete(int tagId)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                Tag? existedTag = TagsQ.GetTagById(_ctx, tagId);
                if (existedTag != null)
                {
                    _ctx.Tags.Remove(existedTag);
                    _ctx.SaveChanges();

                    res.Code = (int)HttpStatusCode.OK;
                    res.Message = HttpStatusCode.OK.ToString();
                    res.Data = $"Tag with Id: '{tagId}' was Deleted successful.";
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no Tag with Id '{tagId}' to Delete";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Delete Tag");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpPut("disassociatetasks/{tagId}")]
        public CustomResponse<string> DisassociateTasksFromTag(int tagId, [FromBody] TagDeleteTasksDto tasksToDelete)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                bool notExistedTasks = false;
                int countOfUpdates = 0;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tasks to Disassociate with Id: ");

                Tag? existedTag = TagsQ.GetTagById(_ctx, tagId);
                if (existedTag != null)
                {
                    if (tasksToDelete.TaskIds != null && tasksToDelete.TaskIds.Count > 0)
                    {
                        for (int i = 0; i < tasksToDelete.TaskIds.Count; i++)
                        {
                            TaskItem? existedTask = TasksQ.GetTaskById(_ctx, tasksToDelete.TaskIds[i]);
                            if (existedTask != null)
                            {
                                existedTag.Tasks.Remove(existedTask);
                                countOfUpdates++;
                            }
                            else
                            {
                                notExistedTasks = true;
                                sb.Append(tasksToDelete.TaskIds[i] + "; ");
                            }
                        }

                        if (countOfUpdates > 0)
                        {
                            _ctx.Tags.Update(existedTag);
                            _ctx.SaveChanges();
                            res.Data = $"Tasks was Disassociated to Tag '{tagId}'. ";
                        }
                        else
                        {
                            res.Data = "There is no correct data to Disassociate. ";
                        }

                        res.Code = (int)HttpStatusCode.OK;
                        res.Message = HttpStatusCode.OK.ToString();
                        res.Data += notExistedTasks == true ? sb.ToString() : string.Empty;
                    }
                    else
                    {
                        res.Code = (int)HttpStatusCode.BadRequest;
                        res.Message = HttpStatusCode.BadRequest.ToString();
                        res.Data = "Tasks list is empty";
                    }
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no Tag with Id: '{tagId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on DeleteTasksFromTag");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }
        
        [HttpGet]
        public CustomResponse<List<TagMaxDataDto>> GetAll()
        {
            CustomResponse<List<TagMaxDataDto>> res = new CustomResponse<List<TagMaxDataDto>>();
            try
            {
                res.Code = (int)HttpStatusCode.OK;
                res.Message = HttpStatusCode.OK.ToString();
                res.Data = TagsQ.GetAllTags(_ctx);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on GetAll Tags\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpGet("{tagId}")]
        public CustomResponse<TagMaxDataDto> GetById(int tagId)
        {
            CustomResponse<TagMaxDataDto> res = new CustomResponse<TagMaxDataDto>();
            try
            {
                Tag? existedTag = TagsQ.GetTagById(_ctx, tagId);
                res.Code = existedTag != null ? (int)HttpStatusCode.OK : (int)HttpStatusCode.BadRequest;
                res.Message = existedTag != null ? HttpStatusCode.OK.ToString() : $"There is NO Tag with id: '{tagId}'";
                res.Data = existedTag != null ? new TagMaxDataDto
                {
                    Id = existedTag.Id,
                    Name = existedTag.Name,
                    Tasks = existedTag.Tasks != null ? existedTag.Tasks.Select(task => new TaskMinDataDto
                    {
                        Id = task.Id,
                        DueDate = task.DueDate,
                        Priority = task.Priority,
                        Title = task.Title
                    }).ToList() : null
                } : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Get Tag By Id\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpPut("{tagId}")]
        public CustomResponse<string> Update(int tagId, [FromBody] TagUpdateDto dataToUpd)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                bool notExistedTasks = false;
                int countOfUpdates = 0;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tasks to add with Id: ");

                Tag? existedTag = TagsQ.GetTagById(_ctx, tagId);
                if (existedTag != null)
                {
                    if (!string.IsNullOrEmpty(dataToUpd.Name))
                    {
                        existedTag.Name = dataToUpd.Name;
                        countOfUpdates++;
                    }

                    if (dataToUpd.Tasks != null && dataToUpd.Tasks.Count > 0)
                    {
                        for (int i = 0; i < dataToUpd.Tasks.Count; i++)
                        {
                            TaskItem? existedTask = TasksQ.GetTaskById(_ctx, dataToUpd.Tasks[i]);
                            if (existedTask != null)
                            {
                                existedTag.Tasks.Add(existedTask);
                                countOfUpdates++;
                            }
                            else
                            {
                                notExistedTasks = true;
                                sb.Append(dataToUpd.Tasks[i] + "; ");
                            }
                        }
                    }

                    if (countOfUpdates > 0)
                    {
                        _ctx.Tags.Update(existedTag);
                        _ctx.SaveChanges();
                        res.Data = $"Tag with Id '{tagId}' was updated. " ;
                    }
                    else
                    {
                        res.Data = "There is no correct data to update. ";
                    }

                    res.Code = (int)HttpStatusCode.OK;
                    res.Message = HttpStatusCode.OK.ToString();
                    res.Data += notExistedTasks == true ? sb.ToString() : string.Empty;
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no Tags with Id '{tagId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Update Tag");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
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
    }
}
