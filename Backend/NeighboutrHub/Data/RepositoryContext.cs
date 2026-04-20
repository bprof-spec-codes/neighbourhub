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
    public DbSet<Vote> Votes { get; set; }
    public DbSet<VoteEntry> VoteEntries { get; set; }
    public DbSet<CommunityRoom> CommunityRooms { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
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

        base.OnModelCreating(builder);


        builder.Entity<VoteEntry>()
            .HasOne(e => e.Vote)
            .WithMany(v => v.Entries)
            .HasForeignKey(e => e.VoteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Booking>()
            .HasOne(b => b.CommunityRoom)
            .WithMany()
            .HasForeignKey(b => b.CommunityRoomId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Booking>()
            .HasOne(b => b.BookedBy)
            .WithMany()
            .HasForeignKey(b => b.BookedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Booking>()
            .Property(b => b.Status)
            .HasConversion<string>();
    }
}