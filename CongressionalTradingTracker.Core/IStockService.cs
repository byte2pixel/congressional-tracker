using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface IStockService
{
    public Task<Ticker[]> GetAllStocksAsync(CancellationToken ct);
}
