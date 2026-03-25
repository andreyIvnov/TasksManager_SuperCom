using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using static server.DTOs.TagDtos;
using static server.DTOs.TaskDtos;

namespace server.Queries
{
    public static class TagsQ
    {
        public static Tag GetTagById(AppDbContext context, int tagId)
        {
			try
			{
				Tag? tagToReturn = null;
				if (context != null && tagId != null)
				{
					tagToReturn = context.Tags
						.Include(tag => tag.Tasks)
						.AsSplitQuery()
						.FirstOrDefault(task => task.Id == tagId);
				}
				return tagToReturn;
			}
			catch (Exception ex)
			{
                throw new Exception("Exception into TagsQ.GetTagById(): " + ex.Message, ex);
			}
        }

		public static List<TagMaxDataDto> GetAllTags(AppDbContext context)
		{
			try
			{
				List<TagMaxDataDto>? listToReturn = null;
				if (context != null)
				{
                    listToReturn = context.Tags
                        .Include(tag => tag.Tasks)
                        .AsSplitQuery()
                        .Select(tag => new TagMaxDataDto
                        {
                            Id = tag.Id,
                            Name = tag.Name,
                            Tasks = tag.Tasks != null ? tag.Tasks.Select(task => new TaskMinDataDto
                            {
                                Id = task.Id,
                                Title = task.Title,
                                DueDate = task.DueDate,
                                Priority = task.Priority
                            }).ToList() : null,
                        }).ToList();
                }
				return listToReturn;
            }
			catch (Exception ex)
			{
                throw new Exception("Exception into TagsQ.GetAllTags(): " + ex.Message, ex);
            }
        }
    }
}
