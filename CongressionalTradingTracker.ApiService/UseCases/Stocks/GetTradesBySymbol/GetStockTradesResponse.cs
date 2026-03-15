namespace CongressionalTradingTracker.ApiService.UseCases.GetTradesBySymbol;

public class GetStockTradesResponse
{
    public required string BioGuideId { get; set; }
    public required string Name { get; set; }
    public required string Party { get; set; }
    public required string House { get; set; }
    public required string State { get; set; }
    public int SaleCount { get; set; }
    public int PurchaseCount { get; set; }
    public int TotalTrades { get; set; }
    public decimal TotalEstimatedVolume { get; set; }
}
