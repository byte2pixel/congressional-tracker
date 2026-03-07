using CongressionalTradingTracker.Domain;
using FastEndpoints;

namespace CongressionalTradingTracker.ApiService.UseCases;

public class StockSearchMapper : ResponseMapper<List<StockSearchResponse>, Ticker[]>
{
    public override List<StockSearchResponse> FromEntity(Ticker[] entity)
    {
        return entity
            .Select(s => new StockSearchResponse
            {
                Symbol = s.Symbol,
                Name = s.Company ?? s.Symbol,
            })
            .ToList();
    }
}
