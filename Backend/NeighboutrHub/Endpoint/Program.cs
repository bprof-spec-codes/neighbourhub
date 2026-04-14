using Data;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
using Logic.Logic;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json.Serialization;

namespace Endpoint;

public class Program
{
    public static void Main(string[] args)
    {
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        builder.Services.Configure<FileStorageSettings>(
            builder.Configuration.GetSection("FileStorageSettings")
        );

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

        builder.Services.AddDbContext<RepositoryContext>(options =>
        {
            options.UseSqlServer(connectionString);
        });
        

        builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
        var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.RequireHttpsMetadata = false; // Fejleszt�s alatt lehet false
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = jwtSettings.Issuer,
                ValidIssuer = jwtSettings.Issuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
                // Fontos: Itt is megmondhatjuk neki, hogy hol keresse a role-t
                RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
                NameClaimType = "unique_name"
            };
        });

        var frontendUrl = builder.Configuration["Cors:FrontendUrl"];
        builder.WebHost.UseUrls("http://localhost:5001");

        builder.Services.AddCors(option =>
        {
            option.AddPolicy("AllowAngularApp", policy =>
            {
                policy.WithOrigins(frontendUrl!)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithExposedHeaders("Content-Disposition");
            });
        });

        builder.Services.AddTransient(typeof(Repository<>));
        builder.Services.AddTransient<VoteLogic>();
        builder.Services.AddTransient<DtoProvider>();
        builder.Services.AddTransient<AnnouncementLogic>();
        builder.Services.AddTransient<ErrorReportLogic>();
        builder.Services.AddTransient<DocumentLogic>();

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
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