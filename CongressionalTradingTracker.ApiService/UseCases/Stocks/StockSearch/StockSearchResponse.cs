namespace CongressionalTradingTracker.ApiService.UseCases;

public class StockSearchResponse
{
    public required string Symbol { get; set; }
    public required string Company { get; set; }
    public string? Website { get; set; }
    public string? Logo { get; set; }
}
