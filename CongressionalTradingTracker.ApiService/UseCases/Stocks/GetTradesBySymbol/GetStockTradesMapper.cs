namespace CongressionalTradingTracker.ApiService.UseCases.GetTradesBySymbol;

public class GetStockTradesMapper
    : ResponseMapper<List<GetStockTradesResponse>, ICollection<MostActiveTraderDto>>
{
    public override Task<List<GetStockTradesResponse>> FromEntityAsync(
        ICollection<MostActiveTraderDto> e,
        CancellationToken ct
    )
    {
        var response = e.Select(t => new GetStockTradesResponse
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
        });
        return Task.FromResult(response.ToList());
    }
}
