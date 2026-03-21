namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetPoliticianMapper : ResponseMapper<GetPoliticianResponse, Politician>
{
    public override GetPoliticianResponse FromEntity(Politician e)
    {
        return new GetPoliticianResponse
        {
            Name = e.Name,
            House = e.House,
            Party = e.Party,
            BioGuideId = e.BioGuideId,
            District = e.District,
            State = e.State ?? "",
            ImageAltText = e.ImageAltText,
            ImageUrl = e.ImageUrl,
        };
    }
}
