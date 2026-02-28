using CongressionalTradingTracker.ApiService.Dtos;
using CongressionalTradingTracker.Domain;
using FastEndpoints;

namespace CongressionalTradingTracker.ApiService.Mappers;

public class StockMapper : ResponseMapper<List<StockResponse>, Ticker[]>
{
    public override List<StockResponse> FromEntity(Ticker[] entity)
    {
        return entity.Select(s => new StockResponse { Symbol = s.Symbol }).ToList();
    }
}
