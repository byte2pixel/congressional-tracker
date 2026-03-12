using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface ITradeService
{
    Task<List<Trade>> MostRecentTradesAsync(CancellationToken ct = default);

    Task<List<MostActiveTraderDto>> MostActiveTradersAsync(
        DateTime from,
        DateTime to,
        int limit = 50,
        CancellationToken ct = default
    );

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
