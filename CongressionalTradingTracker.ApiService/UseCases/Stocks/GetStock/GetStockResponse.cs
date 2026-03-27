namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetStockResponse
{
    public required string Symbol { get; set; }
    public required string Company { get; set; }
    public required string Type { get; set; }
    public string? Website { get; set; }
    public string? Logo { get; set; }
    public required string Industry { get; set; }
    public required string Exchange { get; set; }
}
