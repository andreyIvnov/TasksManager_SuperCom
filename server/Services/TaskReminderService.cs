using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using static server.DTOs.TaskReminderDtos;

namespace server.Services
{
    public class TaskReminderService
    {
        private readonly RabbitMQConnection _rabbitMQ;
        private readonly ILogger<TaskReminderService> _logger;
        
        public TaskReminderService(RabbitMQConnection rabbitMQ, ILogger<TaskReminderService> logger)
        {
            _rabbitMQ = rabbitMQ;
            _logger = logger;
        }

        // Publish reminder message to queue
        public async Task PublishReminderAsync(TaskReminder reminder)
        {
            var channel = await _rabbitMQ.GetChannelAsync();
            var message = JsonSerializer.Serialize(reminder);
            var body = Encoding.UTF8.GetBytes(message);

            var properties = new BasicProperties
            {
                Persistent = true // Message survives server restart
            };

            await channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: "task_reminders",
                mandatory: false,
                basicProperties: properties,
                body: body);

            _logger.LogInformation($"\nPublished reminder for Task ID: {reminder.TaskId}\n");
        }

        // Subscribe to reminder queue and process messages
        public async Task StartConsumerAsync(CancellationToken cancellationToken)
        {
            var channel = await _rabbitMQ.GetChannelAsync();
            
            // Set Quality of Service (process one message at a time)
            await channel.BasicQosAsync(prefetchSize: 0, prefetchCount: 1, global: false);

            var consumer = new AsyncEventingBasicConsumer(channel);
            
            consumer.ReceivedAsync += async (sender, eventArgs) =>
            {
                try
                {
                    var body = eventArgs.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    var reminder = JsonSerializer.Deserialize<TaskReminder>(message);

                    if (reminder != null)
                    {
                        _logger.LogWarning($"\nHi your Task is due {reminder.TaskTitle} (ID: {reminder.TaskId})\n");
                        
                        // Acknowledge message processing
                        await channel.BasicAckAsync(deliveryTag: eventArgs.DeliveryTag, multiple: false);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "\nError processing reminder message\n");
                    // Reject message and don't requeue (avoid infinite retry)
                    await channel.BasicNackAsync(eventArgs.DeliveryTag, multiple: false, requeue: false);
                }
            };

            await channel.BasicConsumeAsync(
                queue: "task_reminders",
                autoAck: false, // Manual acknowledgement for reliability
                consumer: consumer);

            _logger.LogInformation("\nStarted consuming task reminders...\n");
            
            // Keep the consumer running
            while (!cancellationToken.IsCancellationRequested)
            {
                await Task.Delay(1000, cancellationToken);
            }
        }
    }
}