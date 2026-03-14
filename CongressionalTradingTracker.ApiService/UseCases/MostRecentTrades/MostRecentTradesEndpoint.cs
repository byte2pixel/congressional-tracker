namespace CongressionalTradingTracker.ApiService.UseCases;

public class MostRecentTradesEndpoint(ITradeService tradeService)
    : EndpointWithoutRequest<
        Results<Ok<List<MostRecentTradeResponse>>, ProblemDetails>,
        MostRecentTradesMapper
    >
{
    public override void Configure()
    {
        Get("/api/trades/recent");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<
        Results<Ok<List<MostRecentTradeResponse>>, ProblemDetails>
    > ExecuteAsync(CancellationToken ct)
    {
        try
        {
            DateTime from = DateTime.UtcNow.AddMonths(-6);
            DateTime to = DateTime.UtcNow;
            var recentTrades = await tradeService.MostRecentTradesAsync(from, to, 0, ct: ct);
            var response = await Map.FromEntityAsync(recentTrades, ct);
            return TypedResults.Ok(response);
        }
        catch
        {
            AddError("An error occurred while retrieving recent trades.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
