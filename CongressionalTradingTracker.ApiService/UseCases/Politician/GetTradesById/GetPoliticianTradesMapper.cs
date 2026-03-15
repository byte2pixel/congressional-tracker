namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetPoliticianTradesMapper
    : ResponseMapper<List<GetPoliticianTradesResponse>, ICollection<Trade>>
{
    public override Task<List<GetPoliticianTradesResponse>> FromEntityAsync(
        ICollection<Trade> e,
        CancellationToken ct
    )
    {
        var response = e.Select(t => new GetPoliticianTradesResponse
            {
                Symbol = t.Ticker.Symbol,
                TransactionDate = t.TransactionDate,
                Amount = t.Amount,
                TransactionType = t.Transaction,
                Company = t.Ticker.Company ?? "Unknown",
                Range = t.RawRange ?? t.RawAmount,
                ExcessReturn = t.ExcessReturn,
            })
            .ToList();

        return Task.FromResult(response);
    }
}
