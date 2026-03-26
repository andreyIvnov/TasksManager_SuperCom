
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Middlewares;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(opts => opts.AddPolicy("All", builder => builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod()));
builder.Services.AddDbContext<AppDbContext>(opts => opts.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("All");

app.UseMiddleware<ExceptionsMiddleware>();

app.MapControllers();

app.MapGet("/", () => "Hello World!");

app.Run("http://localhost:3000");