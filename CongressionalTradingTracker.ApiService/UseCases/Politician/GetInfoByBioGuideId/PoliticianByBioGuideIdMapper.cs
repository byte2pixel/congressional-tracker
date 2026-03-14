namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianByBioGuideIdMapper
    : ResponseMapper<PoliticianByBioGuideIdResponse, Politician>
{
    public override PoliticianByBioGuideIdResponse FromEntity(Politician e)
    {
        return new PoliticianByBioGuideIdResponse
        {
            Name = e.Name,
            House = e.House,
            Party = e.Party,
            BioGuideId = e.BioGuideId,
            District = e.District ?? "",
            State = e.State ?? "",
        };
    }
}
