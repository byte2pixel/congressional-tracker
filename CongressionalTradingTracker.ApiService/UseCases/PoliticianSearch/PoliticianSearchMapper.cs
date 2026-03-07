using CongressionalTradingTracker.Domain;
using FastEndpoints;

namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianSearchMapper : ResponseMapper<List<PoliticianSearchResponse>, Politician[]>
{
    public override List<PoliticianSearchResponse> FromEntity(Politician[] e)
    {
        return e.Select(p => new PoliticianSearchResponse
            {
                Name = p.Name,
                House = p.House,
                Party = p.Party,
                BioGuideId = p.BioGuideId,
            })
            .ToList();
    }
}
