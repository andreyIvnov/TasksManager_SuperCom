using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Queries
{
    public static class UserQ
    {
        public static User GetUserById(AppDbContext context, int userId)
        {
            try
            {
                User? userToReturn = null;
                if (context != null && userId != null)
                {
                    userToReturn = context.Users
                        .Include(u => u.Tasks)
                        .AsSplitQuery()
                        .FirstOrDefault(task => task.Id == userId);
                }
                return userToReturn;
            }
            catch (Exception ex)
            {
                throw new Exception("Exception into UserQ.GetUserById(): " + ex.Message, ex);
            }
        }

    }
}
