using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.ApiService.Data;

public class TradeDbContext : DbContext
{
    public DbSet<Stock> Stocks { get; set; }

    public TradeDbContext(DbContextOptions<TradeDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Stock>()
            .HasIndex(s => s.Symbol).IsUnique();
    }
}
