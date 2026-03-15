namespace CongressionalTradingTracker.ApiService.UseCases.GetTradesBySymbol;

public class GetStockTradesResponse
{
    public required string BioGuideId { get; set; }
    public required string Name { get; set; }
    public required string Party { get; set; }
    public required string House { get; set; }
    public required string State { get; set; }
    public required DateTime TransactionDate { get; set; }
    public required string TransactionType { get; set; }
    public required decimal Amount { get; set; }
    public required string Range { get; set; }
    public decimal? ExcessReturn { get; set; }
}
