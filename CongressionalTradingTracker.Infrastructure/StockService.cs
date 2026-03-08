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

    public Task<Ticker[]> SearchStocksAsync(string query, int limit, CancellationToken ct)
    {
        return dbContext
            .Stocks.Where(s =>
                EF.Functions.ILike(s.Symbol, $"{query}%")
                || EF.Functions.ILike(s.Company, $"%{query}%")
            )
            .Take(limit)
            .ToArrayAsync(ct);
    }
}
