namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianByBioGuideIdValidator : Validator<PoliticianByBioGuideIdRequest>
{
    public PoliticianByBioGuideIdValidator()
    {
        RuleFor(x => x.BioGuideId)
            .NotEmpty()
            .WithMessage("BioGuideId cannot be empty.")
            .MinimumLength(2)
            .WithMessage("BioGuideId must be a string with a maximum length of 2.")
            .MaximumLength(10)
            .WithMessage("BioGuideId must be a string with a maximum length of 10.")
            .Matches("^[a-zA-Z][0-9]{1,9}$")
            .WithMessage("BioGuideId must start with a letter followed by 1-9 digits.");
    }
}
