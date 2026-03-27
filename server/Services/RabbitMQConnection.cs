using RabbitMQ.Client;

namespace server.Services
{
    public class RabbitMQConnection : IDisposable
    {
        private IConnection? _connection;
        private IChannel? _channel;
        private readonly string _hostname;
        private readonly string _username;
        private readonly string _password;
        
        public RabbitMQConnection(IConfiguration configuration)
        {
            _hostname = configuration["RabbitMQ:Hostname"] ?? "localhost";
            _username = configuration["RabbitMQ:Username"] ?? "guest";
            _password = configuration["RabbitMQ:Password"] ?? "guest";
        }

        public async Task<IChannel> GetChannelAsync()
        {
            if (_connection == null || !_connection.IsOpen)
            {
                await ConnectAsync();
            }
            
            if (_channel == null || !_channel.IsOpen)
            {
                _channel = await _connection!.CreateChannelAsync();
                // Declare the queue (creates if doesn't exist)
                await _channel.QueueDeclareAsync(
                    queue: "task_reminders", 
                    durable: true, 
                    exclusive: false, 
                    autoDelete: false);
            }
            
            return _channel;
        }

        private async Task ConnectAsync()
        {
            var factory = new ConnectionFactory
            {
                HostName = _hostname,
                UserName = _username,
                Password = _password,
                VirtualHost = "/",
                Port = 5672
            };
            
            _connection = await factory.CreateConnectionAsync();
        }

        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}