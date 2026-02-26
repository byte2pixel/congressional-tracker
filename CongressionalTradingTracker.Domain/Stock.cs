namespace CongressionalTradingTracker.Domain;

public class Stock
{
    public int StockId { get; set; }
    public required string Symbol { get; set; }

    /// <summary>Company or fund name (e.g. "Apple Inc.").</summary>
    public string? Company { get; set; }

    /// <summary>Asset class reported by QuiverQuant (e.g. "Stock", "ETF", "Crypto").</summary>
    public string? TickerType { get; set; }
}
