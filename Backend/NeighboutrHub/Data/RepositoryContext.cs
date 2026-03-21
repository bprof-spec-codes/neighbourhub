using Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Data;

public class RepositoryContext : IdentityDbContext<AppUser>
{
    DbSet<Announcement> Announcements { get; set; }
    


    public DbSet<Vote> Votes { get; set; }
    public DbSet<VoteEntry> VoteEntries { get; set; }

    public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options)
    {
        
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<AppUser>()
            .Property(e => e.ApartmentNumber)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
            );

        builder.Entity<AppUser>()
            .Property(e => e.Storage)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
            );

        builder.Entity<AppUser>()
            .Property(e => e.ParkingSpace)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
            );

        builder.Entity<VoteEntry>()
        .HasOne(e => e.Vote)
        .WithMany(v => v.Entries)
        .HasForeignKey(e => e.VoteId)
        .OnDelete(DeleteBehavior.Restrict);
    }
}