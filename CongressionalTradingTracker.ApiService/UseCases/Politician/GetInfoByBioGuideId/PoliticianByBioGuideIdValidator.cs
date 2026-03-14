namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianByBioGuideIdValidator : Validator<PoliticianByBioGuideIdRequest>
{
    public PoliticianByBioGuideIdValidator()
    {
        RuleFor(x => x.BioGuideId).ValidBioGuideId();
    }
}
