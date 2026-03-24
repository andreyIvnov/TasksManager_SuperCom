var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(opts => opts.AddPolicy("All", builder => builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod()));
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.MapGet("/", () => "Hello World!");

app.Run("http://localhost:3000");
