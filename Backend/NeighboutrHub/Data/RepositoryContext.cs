using Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace Data;

public class RepositoryContext : IdentityDbContext<AppUser>
{
    

    public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options)
    {
        
    }
    
}