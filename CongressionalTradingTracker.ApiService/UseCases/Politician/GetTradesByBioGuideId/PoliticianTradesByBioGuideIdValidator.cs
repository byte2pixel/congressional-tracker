namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianTradesByBioGuideIdValidator : Validator<PoliticianTradesByBioGuideIdRequest>
{
    public PoliticianTradesByBioGuideIdValidator()
    {
        RuleFor(x => x.BioGuideId).ValidBioGuideId();
    }
}
