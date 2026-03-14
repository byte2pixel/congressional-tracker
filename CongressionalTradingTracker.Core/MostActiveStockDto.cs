namespace CongressionalTradingTracker.Core;

public class MostActiveStockDto
{
    public required string Symbol { get; set; }
    public string? TickerType { get; set; }
    public string? Company { get; set; }
    public int TotalTrades { get; set; }
    public int PurchaseCount { get; set; }
    public int SaleCount { get; set; }
    public decimal TotalEstimatedVolume { get; set; } // sum of (RangeMid ?? RangeMin) for all trades of this stock
    // public Dictionary<string, int> PartyCounts { get; set; } = []; // Key is party name, value is count of trades by politicians of that party
    // public Dictionary<string, int> HouseCounts { get; set; } = []; // Key is house name, value is count of trades by politicians of that house
}
