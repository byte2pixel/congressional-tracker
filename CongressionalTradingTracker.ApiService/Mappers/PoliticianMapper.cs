using CongressionalTradingTracker.ApiService.Dtos;
using CongressionalTradingTracker.Domain;
using FastEndpoints;

namespace CongressionalTradingTracker.ApiService.Mappers;

public class PoliticianMapper : ResponseMapper<List<PoliticianResponse>, Politician[]>
{
    public override List<PoliticianResponse> FromEntity(Politician[] e)
    {
        return e.Select(p => new PoliticianResponse { Name = p.Name, CurrentPosition = p.House })
            .ToList();
    }
}
