using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Services;
using server.Queries;
using static server.DTOs.TaskReminderDtos;

namespace server.Workers
{
    public class TaskMonitorWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<TaskMonitorWorker> _logger;
        private readonly TaskReminderService _reminderService;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Check every 5 minutes

        public TaskMonitorWorker(
            IServiceProvider serviceProvider,
            ILogger<TaskMonitorWorker> logger,
            TaskReminderService reminderService)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _reminderService = reminderService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("TaskMonitorWorker started");

            // Start the consumer in a separate task
            var consumerTask = Task.Run(() => _reminderService.StartConsumerAsync(stoppingToken), stoppingToken);

            // Main monitoring loop
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckOverdueTasksAsync();
                await Task.Delay(_checkInterval, stoppingToken);
            }

            await consumerTask;
            _logger.LogInformation("TaskMonitorWorker stopped");
        }

        private async Task CheckOverdueTasksAsync()
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Get tasks that are overdue and haven't had reminders sent
                var overdueTasks = await TasksQ.GetOverdueTasksForRemindersAsync(dbContext);

                foreach (var task in overdueTasks)
                {
                    try
                    {
                        // Create reminder object
                        var reminder = new TaskReminder
                        {
                            TaskId = task.Id,
                            TaskTitle = task.Title,
                            DueDate = task.DueDate
                        };

                        // Publish to queue
                        await _reminderService.PublishReminderAsync(reminder);

                        // Mark as reminder sent (with concurrency handling)
                        var success = await TasksQ.MarkReminderSentAsync(dbContext, task.Id);
                        
                        if (success)
                        {
                            _logger.LogInformation($"Reminder queued for overdue task: {task.Title} (ID: {task.Id})");
                        }
                        else
                        {
                            _logger.LogInformation($"Task {task.Id} reminder was already processed by another instance");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to process overdue task {task.Id}");
                    }
                }

                if (overdueTasks.Any())
                {
                    _logger.LogInformation($"Processed {overdueTasks.Count} overdue tasks");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking overdue tasks");
            }
        }
    }
}