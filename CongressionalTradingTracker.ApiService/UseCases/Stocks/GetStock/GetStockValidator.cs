namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetStockValidator : Validator<GetStockRequest>
{
    public GetStockValidator()
    {
        RuleFor(x => x.Symbol)
            .NotEmpty()
            .WithMessage("Symbol is required")
            .Length(1, 128)
            .WithMessage("Symbol length must be between 1 and 32 characters");
    }
}
