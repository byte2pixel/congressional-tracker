using FastEndpoints;
using FluentValidation;

namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianSearchValidator : Validator<PoliticianSearchRequest>
{
    public PoliticianSearchValidator()
    {
        RuleFor(x => x.Query)
            .NotEmpty()
            .WithMessage("Query cannot be empty.")
            .MinimumLength(2)
            .WithMessage("Query length must be greater than 2.")
            .MaximumLength(255)
            .WithMessage("Query is too long. Maximum length is 255 characters.");

        RuleFor(x => x.Limit)
            .GreaterThan(0)
            .WithMessage("Limit must be greater than 0.")
            .LessThan(50)
            .WithMessage("Limit must be less than 50.");
    }
}
