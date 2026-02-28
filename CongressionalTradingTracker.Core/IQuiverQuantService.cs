namespace CongressionalTradingTracker.Core;

public interface IQuiverQuantService
{
    Task<IReadOnlyList<CongressBulkDto>> GetBulkTradesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<CongressLiveDto>> GetLiveTradesAsync(CancellationToken ct = default);
}
