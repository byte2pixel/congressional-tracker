namespace CongressionalTradingTracker.ApiService.UseCases;

public class MostActiveTradersEndpoint(ITradeService tradeService)
    : EndpointWithoutRequest<
        Results<Ok<List<MostActiveTraderResponse>>, ProblemDetails>,
        MostActiveTradersMapper
    >
{
    public override void Configure()
    {
        Get("/api/traders/most-active");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<
        Results<Ok<List<MostActiveTraderResponse>>, ProblemDetails>
    > ExecuteAsync(CancellationToken ct)
    {
        try
        {
            var from = DateTime.UtcNow.AddMonths(-6);
            var to = DateTime.UtcNow;
            var mostActiveTraders = await tradeService.MostActiveTraders(from, to, 0, ct);
            var response = await Map.FromEntityAsync(mostActiveTraders, ct);
            return TypedResults.Ok(response);
        }
        catch
        {
            AddError("An error occurred while retrieving the most active traders.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
