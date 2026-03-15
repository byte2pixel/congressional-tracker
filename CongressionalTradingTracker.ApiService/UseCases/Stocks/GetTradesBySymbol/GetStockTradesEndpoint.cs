namespace CongressionalTradingTracker.ApiService.UseCases.GetTradesBySymbol;

public class GetStockTradesEndpoint(ITradeService tradeService)
    : Endpoint<
        GetStockTradesRequest,
        Results<Ok<List<GetStockTradesResponse>>, ProblemDetails>,
        GetStockTradesMapper
    >
{
    public override void Configure()
    {
        Get("api/stock/{Symbol}/trades");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<
        Results<Ok<List<GetStockTradesResponse>>, ProblemDetails>
    > ExecuteAsync(GetStockTradesRequest req, CancellationToken ct)
    {
        try
        {
            var trades = await tradeService.GetStockTrades(req.Symbol, ct);
            var response = await Map.FromEntityAsync(trades, ct);
            return TypedResults.Ok(response);
        }
        catch (Exception e)
        {
            Logger.LogError(e, "Error retrieving trades for stock symbol {Symbol}", req.Symbol);
            AddError("An error occurred while retrieving trades for the specified stock symbol.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
