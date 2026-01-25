using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.ApiService.Data;

public class TradeDbContext : DbContext
{
    public DbSet<Stock> Stocks { get; set; }

    public TradeDbContext(DbContextOptions<TradeDbContext> options)
        : base(options) { }
}
