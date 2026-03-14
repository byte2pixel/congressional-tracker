namespace CongressionalTradingTracker.Core;

public class MostActiveTraderDto
{
    public int PoliticianId { get; set; }
    public required string BioGuideId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Party { get; set; }
    public string House { get; set; } = string.Empty;
    public string? State { get; set; }
    public int TotalTrades { get; set; }
    public int PurchaseCount { get; set; }
    public int SaleCount { get; set; }
    public decimal TotalEstimatedVolume { get; set; } // sum of (RangeMid ?? RangeMin)
}
