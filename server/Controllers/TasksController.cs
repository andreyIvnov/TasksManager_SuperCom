using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Models;
using server.Queries;
using System.Net;
using System.Text;
using static server.DTOs.TagDtos;
using static server.DTOs.TaskDtos;
using static server.DTOs.UserDtos;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : Controller, ITaskRepository
    {
        private readonly ILogger<TasksController> _logger;
        private readonly AppDbContext _ctx;
        public TasksController(AppDbContext context, ILogger<TasksController> logger)
        {
            _ctx = context;
            _logger = logger;
        }

        [HttpPut("associatetags/{taskId}")]
        public CustomResponse<string> AssociateTagsToTask(int taskId, [FromBody] TaskAddTagsDto tagsToAssociate)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                bool notExistedTags = false;
                int countOfUpdates = 0;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tags to Associate with Id: ");

                TaskItem? existedTask = TasksQ.GetTaskById(_ctx, taskId);
                if (existedTask != null)
                {
                    if (tagsToAssociate.TagIds != null && tagsToAssociate.TagIds.Count > 0)
                    {
                        for (int i = 0; i < tagsToAssociate.TagIds.Count; i++)
                        {
                            Tag? existedTag = TagsQ.GetTagById(_ctx, tagsToAssociate.TagIds[i]);
                            if (existedTag != null)
                            {
                                existedTask.Tags.Add(existedTag);
                                countOfUpdates++;
                            }
                            else
                            {
                                notExistedTags = true;
                                sb.Append(tagsToAssociate.TagIds[i] + "; ");
                            }
                        }

                        if (countOfUpdates > 0)
                        {
                            _ctx.Tasks.Update(existedTask);
                            _ctx.SaveChanges();
                            res.Data = $"Tags was Associated to Task '{taskId}'. ";
                        }
                        else
                        {
                            res.Data = "There is no correct data to Associate. ";
                        }

                        res.Code = (int)HttpStatusCode.OK;
                        res.Message = HttpStatusCode.OK.ToString();
                        res.Data += notExistedTags == true ? sb.ToString() : string.Empty;
                    }
                    else
                    {
                        res.Code = (int)HttpStatusCode.BadRequest;
                        res.Message = HttpStatusCode.BadRequest.ToString();
                        res.Data = "Tags list is empty";
                    }
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no Task with Id: '{taskId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on AddTagsToTask\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpPost]
        public CustomResponse<TaskMaxDataToShowDto> Create([FromBody] TaskCreateDto newTaskData)
        {
            CustomResponse<TaskMaxDataToShowDto> res = new CustomResponse<TaskMaxDataToShowDto>();
            try
            {
                bool notExistedTags = false;
                User? existedUser = null;
                StringBuilder tagsSB = new StringBuilder();
                tagsSB.Append("There is no Tags with Id: ");

                TaskItem taskToCreate = new TaskItem
                {
                    Title = newTaskData.Title,
                    DueDate = newTaskData.DueDate.Value,
                    Priority = newTaskData.Priority.Value,
                };

                #region Filling NOT requered fields

                if (!string.IsNullOrEmpty(newTaskData.Description))
                {
                    taskToCreate.Description = newTaskData.Description;
                }

                if (newTaskData.IsReminderSent != null)
                {
                    taskToCreate.IsReminderSent = newTaskData.IsReminderSent;
                }

                if (newTaskData.UserId != null)
                {
                    existedUser = UserQ.GetUserById(_ctx, newTaskData.UserId.Value);
                    if (existedUser != null)
                    {
                        taskToCreate.UserId = existedUser.Id;
                    }
                }

                if (newTaskData.TagIds != null && newTaskData.TagIds.Count > 0)
                {
                    for (int i = 0; i < newTaskData.TagIds.Count; i++)
                    {
                        Tag? existedTag = TagsQ.GetTagById(_ctx, newTaskData.TagIds[i]);
                        if (existedTag != null)
                        {
                            taskToCreate.Tags.Add(existedTag);
                        }
                        else
                        {
                            notExistedTags = true;
                            tagsSB.Append(newTaskData.TagIds[i] + "; ");
                        }
                    }
                }

                #endregion
                
                _ctx.Tasks.Add(taskToCreate);
                _ctx.SaveChanges();

                res.Code = (int)HttpStatusCode.Created;
                res.Message = $"{HttpStatusCode.Created.ToString()}. {(notExistedTags == true ? tagsSB.ToString() + ". " : string.Empty)} {(existedUser == null && newTaskData.UserId != null ? $"There is no User with Id {newTaskData.UserId}" : string.Empty)}";
                res.Data = new TaskMaxDataToShowDto
                {
                    Id = taskToCreate.Id,
                    Title = taskToCreate.Title,
                    Description = taskToCreate.Description,
                    DueDate = taskToCreate.DueDate,
                    Priority = taskToCreate.Priority,
                    IsReminderSent = taskToCreate.IsReminderSent,
                    Tags = taskToCreate.Tags != null ? taskToCreate.Tags.Select(tag => new TagMinDataDto
                    {
                        Id = tag.Id,
                        Name = tag.Name,
                    }).ToList() : null,
                    User = existedUser != null ? new UserMinDataDto
                    {
                        Id = existedUser.Id,
                        FullName = existedUser.FullName,
                        Email = existedUser.Email,
                        Telephone = existedUser.Telephone,
                    } : null,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on create Task\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpDelete("{taskId}")]
        public CustomResponse<string> Delete(int taskId)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                TaskItem? existedTask = TasksQ.GetTaskById(_ctx, taskId);
                if (existedTask != null)
                {
                    _ctx.Tasks.Remove(existedTask);
                    _ctx.SaveChanges();

                    res.Code = (int)HttpStatusCode.OK;
                    res.Message = HttpStatusCode.OK.ToString();
                    res.Data = $"Task with Id: '{taskId}' was Deleted successful.";
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no Task with Id '{taskId}' to Delete";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Delete Task\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpPut("disassociatetags/{taskId}")]
        public CustomResponse<string> DisassociateTagsFromTask(int taskId, [FromBody] TaskDeleteTags tagsToDisassociate)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                bool notExistedTags = false;
                int countOfUpdates = 0;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tags to Disassociate with Id: ");

                TaskItem? existedTask = TasksQ.GetTaskById(_ctx, taskId);
                if (existedTask != null)
                {
                    if (tagsToDisassociate.TagIds != null && tagsToDisassociate.TagIds.Count > 0)
                    {
                        for (int i = 0; i < tagsToDisassociate.TagIds.Count; i++)
                        {
                            Tag? existedTag = TagsQ.GetTagById(_ctx, tagsToDisassociate.TagIds[i]);
                            if (existedTag != null)
                            {
                                existedTask.Tags.Remove(existedTag);
                                countOfUpdates++;
                            }
                            else
                            {
                                notExistedTags = true;
                                sb.Append(tagsToDisassociate.TagIds[i] + "; ");
                            }
                        }

                        if (countOfUpdates > 0)
                        {
                            _ctx.Tasks.Update(existedTask);
                            _ctx.SaveChanges();
                            res.Data = $"Tags was Disassociated from Task '{taskId}'. ";
                        }
                        else
                        {
                            res.Data = "There is no correct data to Disassociate. ";
                        }

                        res.Code = (int)HttpStatusCode.OK;
                        res.Message = HttpStatusCode.OK.ToString();
                        res.Data += notExistedTags == true ? sb.ToString() : string.Empty;
                    }
                    else
                    {
                        res.Code = (int)HttpStatusCode.BadRequest;
                        res.Message = HttpStatusCode.BadRequest.ToString();
                        res.Data = "Tags list is empty";
                    }
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no Task with Id: '{taskId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on DeleteTagsFromTask");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpGet]
        public CustomResponse<List<TaskMaxDataToShowDto>> GetAll()
        {
            CustomResponse<List<TaskMaxDataToShowDto>> res = new CustomResponse<List<TaskMaxDataToShowDto>>();
            try
            {
                res.Code = (int)HttpStatusCode.OK;
                res.Message = HttpStatusCode.OK.ToString();
                res.Data = TasksQ.GetAllTasks(_ctx);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on GetAll Tags\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpGet("{taskId}")]
        public CustomResponse<TaskMaxDataToShowDto> GetById(int taskId)
        {
            CustomResponse<TaskMaxDataToShowDto> res = new CustomResponse<TaskMaxDataToShowDto>();
            try
            {
                TaskItem? existedTask = TasksQ.GetTaskById(_ctx, taskId);
                if (existedTask != null)
                {
                    res.Code = (int)HttpStatusCode.OK;
                    res.Message = HttpStatusCode.OK.ToString();
                    res.Data = new TaskMaxDataToShowDto
                    {
                        Id = existedTask.Id,
                        Title = existedTask.Title,
                        Description = existedTask.Description,
                        Priority = existedTask.Priority,
                        DueDate = existedTask.DueDate,
                        IsReminderSent = existedTask.IsReminderSent,
                        Tags = existedTask.Tags != null ? existedTask.Tags.Select(tag => new TagMinDataDto
                        {
                            Id = tag.Id,
                            Name = tag.Name,
                        }).ToList() : null,
                        User = existedTask.User != null ? new UserMinDataDto
                        {
                            Id = existedTask.User.Id,
                            FullName = existedTask.User.FullName,
                            Email = existedTask.User.Email,
                            Telephone = existedTask.User.Telephone,
                        } : null
                    };
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = $"There is no Task with Id: '{taskId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Get Task by Id\n");
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
                Data = "Tasks: I'm Alive!"
            };
        }

        [HttpPut("{taskId}")]
        public CustomResponse<string> Update(int taskId, [FromBody] TaskUpdateDto dataToUpd)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                int updatesCount = 0;
                bool notExistedTags = false;
                User? existedUser = null;
                StringBuilder tagsSB = new StringBuilder();
                tagsSB.Append("There is no Tags with Id: ");

                TaskItem? existedTask = TasksQ.GetTaskById(_ctx, taskId);
                if (existedTask != null)
                {
                    if (!string.IsNullOrEmpty(dataToUpd.Title))
                    {
                        existedTask.Title = dataToUpd.Title;
                        updatesCount++;
                    }

                    if (!string.IsNullOrEmpty(dataToUpd.Description))
                    {
                        existedTask.Description = dataToUpd.Description;
                        updatesCount++;
                    }

                    if (dataToUpd.DueDate != null && dataToUpd.DueDate.Value > DateTime.MinValue)
                    {
                        existedTask.DueDate = dataToUpd.DueDate.Value;
                        updatesCount++;
                    }

                    if (dataToUpd.Priority != null)
                    {
                        existedTask.Priority = dataToUpd.Priority.Value;
                        updatesCount++;
                    }

                    if (dataToUpd.IsReminderSent != null)
                    {
                        existedTask.IsReminderSent = dataToUpd.IsReminderSent;
                        updatesCount++;
                    }

                    if (dataToUpd.UserId != null && dataToUpd.UserId.Value > 0)
                    {
                        existedUser = UserQ.GetUserById(_ctx, dataToUpd.UserId.Value);
                        if (existedUser != null)
                        {
                            existedTask.UserId = existedUser.Id;
                            updatesCount++;
                        }
                    }

                    if (dataToUpd.TagIds != null && dataToUpd.TagIds.Count > 0)
                    {
                        for (int i = 0; i < dataToUpd.TagIds.Count; i++)
                        {
                            Tag? existedTag = TagsQ.GetTagById(_ctx, dataToUpd.TagIds[i]);
                            if (existedTag != null)
                            {
                                existedTask.Tags.Add(existedTag);
                                updatesCount++;
                            }
                            else
                            {
                                notExistedTags = true;
                                tagsSB.Append(dataToUpd.TagIds[i] + "; ");
                            }
                        }
                    }

                    if (updatesCount > 0)
                    {
                        _ctx.Tasks.Update(existedTask);
                        _ctx.SaveChanges();
                        res.Data = $"Task with Id '{taskId}' was updated. ";
                    }
                    else
                    {
                        res.Data = "There is no correct data to update. ";
                    }

                    res.Code = (int)HttpStatusCode.OK;
                    res.Message = HttpStatusCode.OK.ToString();
                    res.Data += notExistedTags == true ? tagsSB.ToString() : string.Empty;
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no Task with Id '{taskId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Update Task");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }
    }
}
