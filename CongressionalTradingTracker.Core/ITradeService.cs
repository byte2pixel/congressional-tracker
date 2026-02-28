namespace CongressionalTradingTracker.Core;

public interface ITradeService
{
    Task UpsertBulkTradesAsync(IEnumerable<CongressBulkDto> trades, CancellationToken ct = default);
    Task UpsertLiveTradesAsync(IEnumerable<CongressLiveDto> trades, CancellationToken ct = default);
}
