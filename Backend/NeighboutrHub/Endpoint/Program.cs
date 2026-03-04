using Data;
using Entities.Helpers;
using Logic.Logic;
using Microsoft.EntityFrameworkCore;

namespace Endpoint;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
            
        var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();
            
        var jwtIssuer = jwtSettings!.Issuer;
        var jwtKey = jwtSettings!.Key;
        
        var frontendUrl = builder.Configuration["Cors:FrontendUrl"];
        
        builder.WebHost.UseUrls("http://localhost:5001");
        
        builder.Services.AddCors(option =>
        {
            option.AddPolicy("AllowAngularApp", policy =>
            {
                policy.WithOrigins(frontendUrl!)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        
        builder.Services.AddTransient(typeof(Repository<>));
        builder.Services.AddTransient<TestLogic>();
        
        builder.Services.AddDbContext<RepositoryContext>(options =>
        {
            options.UseSqlServer(connectionString);
        });
        // Add services to the container.
        builder.Services.AddAuthorization();
        
        builder.Services.AddControllers();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowAngularApp");
        
        app.UseHttpsRedirection();
        
        app.UseAuthorization();
        
        app.MapControllers();

        app.Run();
    }
}