using Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Data;

public class RepositoryContext : IdentityDbContext
{
    public DbSet<Test> Tests { get; set; }

    public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options)
    {
        
    }
}