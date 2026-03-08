namespace CongressionalTradingTracker.Core;

public interface ITradeService
{
    Task UpsertBulkTradesAsync(
        IEnumerable<CongressBulkDto> trades,
        IFinnhubService finnhub,
        CancellationToken ct = default
    );
    Task UpsertLiveTradesAsync(
        IEnumerable<CongressLiveDto> trades,
        IFinnhubService finnhub,
        CancellationToken ct = default
    );
}
