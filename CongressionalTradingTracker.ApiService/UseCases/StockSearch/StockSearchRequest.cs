namespace CongressionalTradingTracker.ApiService.UseCases;

public class StockSearchRequest
{
    public string Query { get; set; } = string.Empty;
    public int Limit { get; set; } = 10;
}
