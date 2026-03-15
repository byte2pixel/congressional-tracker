namespace CongressionalTradingTracker.ApiService.UseCases.GetTradesBySymbol;

public class GetStockTradesMapper : ResponseMapper<List<GetStockTradesResponse>, ICollection<Trade>>
{
    public override Task<List<GetStockTradesResponse>> FromEntityAsync(
        ICollection<Trade> e,
        CancellationToken ct
    )
    {
        var response = e.Select(t => new GetStockTradesResponse
        {
            BioGuideId = t.Politician.BioGuideId,
            Name = t.Politician.Name,
            Party = t.Politician.Party ?? "Unknown",
            House = t.Politician.House,
            State = t.Politician.State ?? "Unknown",
            TransactionDate = t.TransactionDate,
            TransactionType = t.Transaction,
            Amount = t.Amount,
            Range = t.RawRange ?? t.RawAmount,
            ExcessReturn = t.ExcessReturn,
        });
        return Task.FromResult(response.ToList());
    }
}
