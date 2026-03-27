
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Middlewares;
using server.Services;
using server.Workers;

var builder = WebApplication.CreateBuilder(args);

// Configure Windows Service hosting
builder.Host.UseWindowsService();

// CORS configuration
builder.Services.AddCors(opts => opts.AddPolicy("All", builder => builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod()));

// Database configuration
builder.Services.AddDbContext<AppDbContext>(opts => opts.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register services
builder.Services.AddControllers();

// Register RabbitMQ services
builder.Services.AddSingleton<RabbitMQConnection>();
builder.Services.AddSingleton<TaskReminderService>();

// Register the Windows Service worker
builder.Services.AddHostedService<TaskMonitorWorker>();

// Add logging configuration
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddEventLog(); // For Windows Event Log
});

var app = builder.Build();

app.UseCors("All");

app.UseMiddleware<ExceptionsMiddleware>();

app.MapControllers();

app.MapGet("/", () => "Hello World!");

app.Run("http://localhost:3000");