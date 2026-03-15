namespace CongressionalTradingTracker.ApiService.UseCases.GetTradesBySymbol;

public class GetStockTradesValidator : Validator<GetStockTradesRequest>
{
    public GetStockTradesValidator()
    {
        RuleFor(s => s.Symbol)
            .NotEmpty()
            .WithMessage("Symbol is required")
            .MaximumLength(10)
            .WithMessage("Symbol must be less than 10 characters");
    }
}
