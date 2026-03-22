using Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace Data;

public class RepositoryContext : IdentityDbContext
{
    public DbSet<ErrorReport> ErrorReports { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<AppUser> AppUsers { get; set; }

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

        builder.Entity<ErrorReport>()
            .HasOne(e => e.ReportedBy)
            .WithMany()
            .HasForeignKey(e => e.ReportedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ErrorReport>()
            .Property(e => e.Category)
            .HasConversion<string>();

        builder.Entity<ErrorReport>()
            .Property(e => e.Priority)
            .HasConversion<string>();

        builder.Entity<ErrorReport>()
            .Property(e => e.Status)
            .HasConversion<string>();
    }
}