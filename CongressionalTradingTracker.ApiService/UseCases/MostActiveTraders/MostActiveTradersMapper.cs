namespace CongressionalTradingTracker.ApiService.UseCases;

public class MostActiveTradersMapper
    : ResponseMapper<List<MostActiveTraderResponse>, List<MostActiveTraderDto>>
{
    public override Task<List<MostActiveTraderResponse>> FromEntityAsync(
        List<MostActiveTraderDto> e,
        CancellationToken ct
    )
    {
        var responses = e.Select(t => new MostActiveTraderResponse
            {
                BioGuideId = t.BioGuideId,
                Name = t.Name,
                Party = t.Party ?? "Unknown",
                House = t.House,
                State = t.State ?? "Unknown",
                TotalTrades = t.TotalTrades,
                TotalEstimatedVolume = t.TotalEstimatedVolume,
                PurchaseCount = t.PurchaseCount,
                SaleCount = t.SaleCount,
            })
            .ToList();

        return Task.FromResult(responses);
    }
}
