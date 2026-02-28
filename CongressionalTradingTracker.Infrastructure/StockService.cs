using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.Infrastructure;

public class StockService(TradeDbContext dbContext) : IStockService
{
    public Task<Ticker[]> GetAllStocksAsync(CancellationToken ct)
    {
        return dbContext.Stocks.ToArrayAsync(ct);
    }
}
