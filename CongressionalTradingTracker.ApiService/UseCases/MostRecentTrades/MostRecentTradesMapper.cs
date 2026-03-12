namespace CongressionalTradingTracker.ApiService.UseCases;

public class MostRecentTradesMapper : ResponseMapper<List<MostRecentTradeResponse>, List<Trade>>
{
    public override Task<List<MostRecentTradeResponse>> FromEntityAsync(
        List<Trade> e,
        CancellationToken ct
    )
    {
        var responses = e.Select(t => new MostRecentTradeResponse
            {
                BioGuideId = t.Politician.BioGuideId ?? string.Empty,
                Name = t.Politician.Name,
                Party = t.Politician.Party ?? "Unknown",
                House = t.Politician.House,
                Symbol = t.Ticker.Symbol,
                Company = t.Ticker.Company ?? t.Ticker.Symbol,
                TransactionDate = t.TransactionDate,
                TransactionType = t.Transaction,
                Amount = t.Amount,
                Range = t.RawRange ?? t.RawAmount,
                ExcessReturn = t.ExcessReturn,
            })
            .ToList();

        return Task.FromResult(responses);
    }
}
