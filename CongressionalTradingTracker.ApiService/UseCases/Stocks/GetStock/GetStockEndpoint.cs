namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetStockEndpoint(IStockService service)
    : Endpoint<GetStockRequest, Results<Ok<GetStockResponse>, ProblemDetails>, GetStockMapper>
{
    public override void Configure()
    {
        Get("/api/stock/{Symbol}");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<Results<Ok<GetStockResponse>, ProblemDetails>> ExecuteAsync(
        GetStockRequest req,
        CancellationToken ct
    )
    {
        try
        {
            var ticker = await service.GetStock(req.Symbol, ct);
            if (ticker != null)
            {
                return TypedResults.Ok(Map.FromEntity(ticker));
            }

            AddError("Stock not found.");
            return new ProblemDetails(ValidationFailures);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error retrieving stock with Symbol {Symbol}", req.Symbol);
            AddError("An error occurred while retrieving the stock.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
