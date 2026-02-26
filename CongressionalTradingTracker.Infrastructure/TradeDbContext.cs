using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.Infrastructure;

public class TradeDbContext : DbContext
{
    public DbSet<Stock> Stocks { get; set; }
    public DbSet<Politician> Politicians { get; set; }
    public DbSet<Trade> Trades { get; set; }
    public DbSet<SyncState> SyncStates { get; set; }

    public TradeDbContext(DbContextOptions<TradeDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Stock>().HasIndex(s => s.Symbol).IsUnique();
        modelBuilder.Entity<Politician>().HasIndex(s => s.Name).IsUnique();

        modelBuilder
            .Entity<Trade>()
            .HasIndex(t => new
            {
                t.PoliticianId,
                t.StockId,
                t.TransactionDate,
                t.Transaction,
            })
            .IsUnique();

        modelBuilder
            .Entity<Trade>()
            .HasOne(t => t.Politician)
            .WithMany()
            .HasForeignKey(t => t.PoliticianId);

        modelBuilder.Entity<Trade>().HasOne(t => t.Stock).WithMany().HasForeignKey(t => t.StockId);
    }
}
