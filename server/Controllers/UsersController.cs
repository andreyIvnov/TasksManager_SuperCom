using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Models;
using server.Queries;
using System.Net;
using System.Text;
using static server.DTOs.TaskDtos;
using static server.DTOs.UserDtos;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller, IUserRepository
    {
        private readonly ILogger<UsersController> _logger;
        private readonly AppDbContext _ctx;
        public UsersController(AppDbContext context, ILogger<UsersController> logger)
        {
            _ctx = context;
            _logger = logger;
        }

        [HttpPut("associatetasks/{userId}")]
        public CustomResponse<string> AssociateTasksToUser(int userId, [FromBody] UserAddTasksDto tasksToAdd)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                bool notExistedTasks = false;
                int countOfUpdates = 0;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tasks to add with Id: ");

                User? existedUser = UserQ.GetUserById(_ctx, userId);
                if (existedUser != null)
                {
                    if (tasksToAdd.TaskIds != null && tasksToAdd.TaskIds.Count > 0)
                    {
                        for (int i = 0; i < tasksToAdd.TaskIds.Count; i++)
                        {
                            TaskItem? existedTask = TasksQ.GetTaskById(_ctx, tasksToAdd.TaskIds[i]);
                            if (existedTask != null)
                            {
                                existedUser.Tasks.Add(existedTask);
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
                            _ctx.Users.Update(existedUser);
                            _ctx.SaveChanges();
                            res.Data = $"Tasks was Associated to User '{userId}'. ";
                        }
                        else
                        {
                            res.Data = "There is no correct data to Associate. ";
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
                    res.Data = $"There is no User with Id: '{userId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on AddTasksToUser\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpPost]
        public CustomResponse<UserMaxDataDto> Create([FromBody] UserCreateDto newUserData)
        {
            CustomResponse<UserMaxDataDto> res = new CustomResponse<UserMaxDataDto>();
            try
            {
                bool notExistedTasks = false;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tasks with Id: ");

                User userToCreate = new User();
                if (!string.IsNullOrEmpty(newUserData.FullName))
                {
                    userToCreate.FullName = newUserData.FullName;
                }
                if (!string.IsNullOrEmpty(newUserData.Telephone))
                {
                    userToCreate.Telephone = newUserData.Telephone;
                }
                if (!string.IsNullOrEmpty(newUserData.Email))
                {
                    userToCreate.Email = newUserData.Email;
                }
                if (newUserData.TaskIds != null && newUserData.TaskIds.Count > 0)
                {
                    for (int i = 0; i < newUserData.TaskIds.Count; i++)
                    {
                        TaskItem? existedTask = TasksQ.GetTaskById(_ctx, newUserData.TaskIds[i]);
                        if (existedTask != null)
                        {
                            userToCreate.Tasks.Add(existedTask);
                        }
                        else
                        {
                            notExistedTasks = true;
                            sb.Append(newUserData.TaskIds[i] + "; ");
                        }
                    }
                }

                _ctx.Users.Add(userToCreate);
                _ctx.SaveChanges();

                res.Code = (int)HttpStatusCode.Created;
                res.Message = HttpStatusCode.Created.ToString() + ". " + (notExistedTasks == true ? sb.ToString() : string.Empty);
                res.Data = new UserMaxDataDto
                {
                    Id = userToCreate.Id,
                    FullName = userToCreate.FullName,
                    Telephone = userToCreate.Telephone,
                    Email = userToCreate.Email,
                    Tasks = userToCreate.Tasks.Count > 0 ? userToCreate.Tasks.Select(task => new TaskMinDataDto
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
                _logger.LogError(ex, "\nException on create User\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpDelete("{userId}")]
        public CustomResponse<string> Delete(int userId)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                User? existedUser = UserQ.GetUserById(_ctx, userId);
                if (existedUser != null)
                {
                    _ctx.Users.Remove(existedUser);
                    _ctx.SaveChanges();

                    res.Code = (int)HttpStatusCode.OK;
                    res.Message = HttpStatusCode.OK.ToString();
                    res.Data = $"User with Id: '{userId}' was Deleted successful.";
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = $"There is no User with Id '{userId}' to Delete";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Delete User\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpPut("disassociatetasks/{userId}")]
        public CustomResponse<string> DisassociateTasksFromUser(int userId, [FromBody] UserDeleteTasksDto tasksToDelete)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                bool notExistedTasks = false;
                int countOfUpdates = 0;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tasks to Disassociate with Id: ");

                User? existedUser = UserQ.GetUserById(_ctx, userId);
                if (existedUser != null)
                {
                    if (tasksToDelete.TaskIds != null && tasksToDelete.TaskIds.Count > 0)
                    {
                        for (int i = 0; i < tasksToDelete.TaskIds.Count; i++)
                        {
                            TaskItem? existedTask = TasksQ.GetTaskById(_ctx, tasksToDelete.TaskIds[i]);
                            if (existedTask != null)
                            {
                                existedUser.Tasks.Remove(existedTask);
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
                            _ctx.Users.Update(existedUser);
                            _ctx.SaveChanges();
                            res.Data = $"Tasks was Disassociated from User '{userId}'. ";
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
                    res.Data = $"There is no User with Id: '{userId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on DeleteTasksFromUser\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpGet]
        public CustomResponse<List<UserMaxDataDto>> GetAll()
        {
            CustomResponse<List<UserMaxDataDto>> res = new CustomResponse<List<UserMaxDataDto>>();
            try
            {
                List<UserMaxDataDto>? listToReturn = null;
                if (_ctx != null)
                {
                    listToReturn = _ctx.Users
                        .Include(user => user.Tasks)
                        .AsSplitQuery()
                        .Select(user => new UserMaxDataDto
                        {
                            Id = user.Id,
                            FullName = user.FullName,
                            Telephone = user.Telephone,
                            Email = user.Email,
                            Tasks = user.Tasks != null ? user.Tasks.Select(task => new TaskMinDataDto
                            {
                                Id = task.Id,
                                Title = task.Title,
                                DueDate = task.DueDate,
                                Priority = task.Priority
                            }).ToList() : null,
                        }).ToList();
                }

                res.Code = (int)HttpStatusCode.OK;
                res.Message = HttpStatusCode.OK.ToString();
                res.Data = listToReturn;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on GetAll Users\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpGet("{userId}")]
        public CustomResponse<UserMaxDataDto> GetById(int userId)
        {
            CustomResponse<UserMaxDataDto> res = new CustomResponse<UserMaxDataDto>();
            try
            {
                User? existedUser = UserQ.GetUserById(_ctx, userId);
                if (existedUser != null)
                {
                    res.Code = (int)HttpStatusCode.OK;
                    res.Message = HttpStatusCode.OK.ToString();
                    res.Data = new UserMaxDataDto
                    {
                        Id = existedUser.Id,
                        FullName = existedUser.FullName,
                        Telephone = existedUser.Telephone,
                        Email = existedUser.Email,
                        Tasks = existedUser.Tasks != null ? existedUser.Tasks.Select(task => new TaskMinDataDto
                        {
                            Id = task.Id,
                            Title = task.Title,
                            Priority = task.Priority,
                            DueDate = task.DueDate
                        }).ToList() : null
                    };
                }
                else
                {
                    res.Code = (int)HttpStatusCode.BadRequest;
                    res.Message = HttpStatusCode.BadRequest.ToString();
                    res.Data = null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Get User By Id\n");
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
                Data = "Users: I'm Alive!"
            };
        }

        [HttpPut("{userId}")]
        public CustomResponse<string> Update(int userId, [FromBody] UserUpdateDto dataToUpd)
        {
            CustomResponse<string> res = new CustomResponse<string>();
            try
            {
                int updatesCount = 0;
                bool notExistedTasks = false;
                StringBuilder sb = new StringBuilder();
                sb.Append("There is no Tasks with Id: ");

                User? existedUser = UserQ.GetUserById(_ctx, userId);
                if (existedUser != null)
                {
                    if (!string.IsNullOrEmpty(dataToUpd.FullName))
                    {
                        existedUser.FullName = dataToUpd.FullName;
                        updatesCount++;
                    }

                    if (!string.IsNullOrEmpty(dataToUpd.Telephone))
                    {
                        existedUser.Telephone = dataToUpd.Telephone;
                        updatesCount++;
                    }

                    if (!string.IsNullOrEmpty(dataToUpd.Email))
                    {
                        existedUser.Email = dataToUpd.Email;
                        updatesCount++;
                    }

                    if (dataToUpd.TaskIds != null && dataToUpd.TaskIds.Count > 0)
                    {
                        for (int i = 0; i < dataToUpd.TaskIds.Count; i++)
                        {
                            TaskItem? existedTask = TasksQ.GetTaskById(_ctx, dataToUpd.TaskIds[i]);
                            if (existedTask != null)
                            {
                                existedUser.Tasks.Add(existedTask);
                                updatesCount++;
                            }
                            else
                            {
                                notExistedTasks = true;
                                sb.Append(dataToUpd.TaskIds[i] + "; ");
                            }
                        }
                    }

                    if (updatesCount > 0)
                    {
                        _ctx.Users.Update(existedUser);
                        _ctx.SaveChanges();
                        res.Data = $"User with Id '{userId}' was updated. ";
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
                    res.Data = $"There is no User with Id '{userId}'";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\nException on Update User\n");
                res.Code = (int)HttpStatusCode.InternalServerError;
                res.Message = ex.Message;
            }
            return res;
        }
    }
}
