namespace CongressionalTradingTracker.ApiService.UseCases;

public class MostActiveStockResponse
{
    public required string Symbol { get; set; }
    public string? Company { get; set; }
    public string? TickerType { get; set; }
    public int TotalTrades { get; set; }
    public int PurchaseCount { get; set; }
    public int SaleCount { get; set; }
    public decimal TotalEstimatedVolume { get; set; }
}

