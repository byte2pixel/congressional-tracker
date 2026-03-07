using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface IStockService
{
    public Task<Ticker[]> SearchStocksAsync(string query, int limit, CancellationToken ct);
}
