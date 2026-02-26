using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface IStockService
{
    public Task<Stock[]> GetAllStocksAsync(CancellationToken ct);
}
