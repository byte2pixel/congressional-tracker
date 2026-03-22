namespace CongressionalTradingTracker.ApiService.UseCases;

public class StockSearchMapper : ResponseMapper<List<StockSearchResponse>, Ticker[]>
{
    public override List<StockSearchResponse> FromEntity(Ticker[] entity)
    {
        return entity
            .Select(s => new StockSearchResponse
            {
                Symbol = s.Symbol,
                Company = s.Company ?? s.Symbol,
                Website = s.Website,
                Logo = s.Logo,
            })
            .ToList();
    }
}
