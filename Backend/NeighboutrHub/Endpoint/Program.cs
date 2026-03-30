using Data;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
using Logic.Logic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Endpoint;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

        // JWT Authentication setup
        var jwtSection = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();
        var jwtIssuer = jwtSection!.Issuer;
        var jwtKey = jwtSection!.Key;
        
        builder.Services.AddIdentity<AppUser, IdentityRole>(
                option =>
                {
                    option.Password.RequireDigit = false;
                    option.Password.RequiredLength = 8;
                    option.Password.RequireNonAlphanumeric = false;
                    option.Password.RequireUppercase = false;
                    option.Password.RequireLowercase = false;
                })
            .AddEntityFrameworkStores<RepositoryContext>()   
            .AddDefaultTokenProviders();

        builder.Services.AddAuthentication(option =>
        {
            option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.RequireHttpsMetadata = true;
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = jwtIssuer,
                ValidIssuer = jwtIssuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            };
        });
        
        builder.Services.AddDbContext<RepositoryContext>(options =>
        {
            options.UseSqlServer(connectionString);
        });
        

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

        builder.Services.AddTransient<VoteLogic>();

        builder.Services.AddTransient<DtoProvider>();
        builder.Services.AddTransient<AnnouncementLogic>();
        builder.Services.AddTransient<ErrorReportLogic>();

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(option =>
        {
            option.SwaggerDoc("v1", new OpenApiInfo { Title = "NeighbourHub API", Version = "v1" });
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
        });

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