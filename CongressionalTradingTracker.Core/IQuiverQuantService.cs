namespace CongressionalTradingTracker.Core;

public interface IQuiverQuantService
{
    Task<IReadOnlyList<CongressTradeDto>> GetBulkTradesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<CongressTradeDto>> GetLiveTradesAsync(CancellationToken ct = default);
}
