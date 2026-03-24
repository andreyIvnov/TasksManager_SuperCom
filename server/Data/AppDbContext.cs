using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users => Set<User> ();
        public DbSet<TaskItem> Tasks => Set<TaskItem> ();
        public DbSet<Tag> Tags => Set<Tag> ();

        public AppDbContext(DbContextOptions opts) : base(opts) { }
        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<TaskItem>()
                .HasMany(t => t.Tags)
                .WithMany(tag => tag.Tasks)
                .UsingEntity(j => j.ToTable("TaskTags"));

            mb.Entity<TaskItem>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
