namespace CongressionalTradingTracker.ApiService.UseCases;

public class MostActiveStocksEndpoint(ITradeService tradeService)
    : EndpointWithoutRequest<
        Results<Ok<List<MostActiveStockResponse>>, ProblemDetails>,
        MostActiveStocksMapper
    >
{
    public override void Configure()
    {
        Get("/api/stocks/most-active");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<
        Results<Ok<List<MostActiveStockResponse>>, ProblemDetails>
    > ExecuteAsync(CancellationToken ct)
    {
        try
        {
            var from = DateTime.UtcNow.AddMonths(-6);
            var to = DateTime.UtcNow;
            var mostActiveStocks = await tradeService.MostActiveStocks(from, to, 0, ct);
            var response = await Map.FromEntityAsync(mostActiveStocks, ct);
            return TypedResults.Ok(response);
        }
        catch
        {
            AddError("An error occurred while retrieving the most active stocks.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
