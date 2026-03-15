using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.Infrastructure;

public class StockService(TradeDbContext dbContext) : IStockService
{
    public Task<Ticker[]> SearchStocks(string query, int limit, CancellationToken ct)
    {
        return dbContext
            .Stocks.Where(s =>
                EF.Functions.ILike(s.Symbol, $"{query}%")
                || EF.Functions.ILike(s.Company ?? string.Empty, $"%{query}%")
            )
            .Take(limit)
            .ToArrayAsync(ct);
    }

    public Task<Ticker?> GetStock(string symbol, CancellationToken ct)
    {
        return dbContext.Stocks.Where(s => s.Symbol == symbol).FirstOrDefaultAsync(ct);
    }
}
