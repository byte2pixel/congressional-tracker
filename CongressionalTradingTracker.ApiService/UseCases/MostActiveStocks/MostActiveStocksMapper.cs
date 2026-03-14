namespace CongressionalTradingTracker.ApiService.UseCases;

public class MostActiveStocksMapper
    : ResponseMapper<List<MostActiveStockResponse>, List<MostActiveStockDto>>
{
    public override Task<List<MostActiveStockResponse>> FromEntityAsync(
        List<MostActiveStockDto> e,
        CancellationToken ct
    )
    {
        var responses = e.Select(s => new MostActiveStockResponse
            {
                Symbol = s.Symbol,
                Company = s.Company,
                TickerType = s.TickerType,
                TotalTrades = s.TotalTrades,
                PurchaseCount = s.PurchaseCount,
                SaleCount = s.SaleCount,
                TotalEstimatedVolume = s.TotalEstimatedVolume,
            })
            .ToList();

        return Task.FromResult(responses);
    }
}
