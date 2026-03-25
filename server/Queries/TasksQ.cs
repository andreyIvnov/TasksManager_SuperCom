using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using static server.DTOs.TagDtos;
using static server.DTOs.TaskDtos;
using static server.DTOs.UserDtos;

namespace server.Queries
{
    public static class TasksQ
    {
        public static TaskItem GetTaskById(AppDbContext context, int taskId)
        {
            try
            {
                TaskItem? taskToReturn = null;
                if (context != null && taskId != null)
                {
                    taskToReturn = context.Tasks
                        .Include(task => task.Tags)
                        .Include(task => task.User)
                        .AsSplitQuery()
                        .FirstOrDefault(task => task.Id == taskId);
                }
                return taskToReturn;
            }
            catch (Exception ex)
            {
                throw new Exception("Exception into TasksQ.GetTaskById(): " + ex.Message, ex);
            }
        }

        public static List<TaskMaxDataToShowDto> GetAllTasks(AppDbContext context)
        {
            try
            {
                List<TaskMaxDataToShowDto>? listToReturn = null;
                if (context != null)
                {
                    listToReturn = context.Tasks
                        .Include(task => task.Tags)
                        .Include(task => task.User)
                        .AsSplitQuery()
                        .Select(task => new TaskMaxDataToShowDto
                        {
                            Id = task.Id,
                            Title = task.Title,
                            Description = task.Description,
                            DueDate = task.DueDate,
                            Priority = task.Priority,
                            IsReminderSent = task.IsReminderSent,
                            User = task.User != null ? new UserMinDataDto
                            {
                                Id = task.User.Id,
                                FullName = task.User.FullName,
                                Email = task.User.Email,
                                Telephone = task.User.Telephone,
                            } : null,
                            Tags = task.Tags != null ? task.Tags.Select(tag => new TagMinDataDto
                            {
                                Id = tag.Id,
                                Name = tag.Name,
                            }).ToList() : null,
                        }).ToList();

                }
                return listToReturn;
            }
            catch (Exception ex)
            {
                throw new Exception("Exception into TasksQ.GetAllTasks(): " + ex.Message, ex);
            }
        }
    }
}
