namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetPoliticianValidator : Validator<GetPoliticianRequest>
{
    public GetPoliticianValidator()
    {
        RuleFor(x => x.BioGuideId).ValidBioGuideId();
    }
}
