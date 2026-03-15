namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetStockResponse
{
    public required string Symbol { get; set; }
    public required string Company { get; set; }
    public required string Type { get; set; }
}
