namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianTradeByBioGuideIdResponse
{
    public required string Symbol { get; set; }
    public required string Company { get; set; }
    public required DateTime TransactionDate { get; set; }
    public required string TransactionType { get; set; }
    public required decimal Amount { get; set; }
    public required string Range { get; set; }
    public decimal? ExcessReturn { get; set; }
}
