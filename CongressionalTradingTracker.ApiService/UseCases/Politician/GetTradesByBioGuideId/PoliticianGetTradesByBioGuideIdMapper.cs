namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianGetTradesByBioGuideIdMapper
    : ResponseMapper<List<PoliticianTradeByBioGuideIdResponse>, ICollection<Trade>>
{
    public override Task<List<PoliticianTradeByBioGuideIdResponse>> FromEntityAsync(
        ICollection<Trade> e,
        CancellationToken ct
    )
    {
        var response = e.Select(t => new PoliticianTradeByBioGuideIdResponse
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
