using Data;
using Entities.Helpers;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Endpoint;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

        
        builder.Services.AddDbContext<RepositoryContext>(options =>
        {
            options.UseSqlServer(connectionString);
        });

        
        builder.Services.AddIdentity<AppUser, IdentityRole>(options => {
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false; 
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<RepositoryContext>()
        .AddDefaultTokenProviders();

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

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowAngularApp");

        app.UseAuthentication(); 
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}