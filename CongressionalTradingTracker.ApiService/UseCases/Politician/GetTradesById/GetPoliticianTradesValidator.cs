namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetPoliticianTradesValidator : Validator<GetPoliticianTradesRequest>
{
    public GetPoliticianTradesValidator()
    {
        RuleFor(x => x.BioGuideId).ValidBioGuideId();
    }
}
