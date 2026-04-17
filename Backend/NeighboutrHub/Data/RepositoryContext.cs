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
    public DbSet<Document> Documents { get; set; }


    public DbSet<Vote> Votes { get; set; }
    public DbSet<VoteEntry> VoteEntries { get; set; }
    public DbSet<Message> Messages { get; set; }

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

        builder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany()
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(m => m.ReplyTo)
            .WithMany()
            .HasForeignKey(m => m.ReplyToId)
            .OnDelete(DeleteBehavior.Restrict);



    }
}