using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface IStockService
{
    public Task<Ticker[]> SearchStocks(string query, int limit, CancellationToken ct);
    public Task<Ticker?> GetStock(string symbol, CancellationToken ct);
}
