using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.Infrastructure;

public class TradeDbContext : DbContext
{
    public DbSet<Stock> Stocks { get; set; }
    public DbSet<Politician> Politicians { get; set; }

    public TradeDbContext(DbContextOptions<TradeDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Stock>().HasIndex(s => s.Symbol).IsUnique();
        modelBuilder.Entity<Politician>().HasIndex(s => s.Name).IsUnique();
    }
}
