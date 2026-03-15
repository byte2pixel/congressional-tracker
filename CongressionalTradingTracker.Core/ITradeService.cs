using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface ITradeService
{
    Task<List<Trade>> MostRecentTrades(
        DateTime from,
        DateTime to,
        int limit = 50,
        CancellationToken ct = default
    );

    Task<List<MostActiveTraderDto>> MostActiveTraders(
        DateTime from,
        DateTime to,
        int limit = 50,
        CancellationToken ct = default
    );

    Task<List<MostActiveStockDto>> MostActiveStocks(
        DateTime from,
        DateTime to,
        int limit = 50,
        CancellationToken ct = default
    );

    Task<List<MostActiveTraderDto>> GetStockTrades(string symbol, CancellationToken ct = default);

    Task UpsertBulkTrades(
        IEnumerable<CongressBulkDto> trades,
        IFinnhubService finnhub,
        CancellationToken ct = default
    );
    Task UpsertLiveTrades(
        IEnumerable<CongressLiveDto> trades,
        IFinnhubService finnhub,
        CancellationToken ct = default
    );
}
