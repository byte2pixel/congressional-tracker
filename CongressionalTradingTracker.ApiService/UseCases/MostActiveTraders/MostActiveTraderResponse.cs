namespace CongressionalTradingTracker.ApiService.UseCases;

public class MostActiveTraderResponse
{
    public required string BioGuideId { get; set; }
    public required string Name { get; set; }
    public required string Party { get; set; }
    public required string House { get; set; }
    public required string State { get; set; }
    public int SaleCount { get; set; }
    public int PurchaseCount { get; set; }
    public required int TotalTrades { get; set; }
    public decimal TotalEstimatedVolume { get; set; }
}
