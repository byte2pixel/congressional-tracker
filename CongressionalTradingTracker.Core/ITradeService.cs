namespace CongressionalTradingTracker.Core;

public interface ITradeService
{
    /// <summary>
    /// Upserts trades into the database. Politicians and Stocks are
    /// created on demand. Duplicate trades (same politician, stock,
    /// transaction date, and transaction type) are silently skipped.
    /// </summary>
    Task UpsertTradesAsync(IEnumerable<CongressTradeDto> trades, CancellationToken ct = default);
}
