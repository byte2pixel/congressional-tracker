using CongressionalTradingTracker.Core;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CongressionalTradingTracker.ApiService.UseCases;

public class StockSearchEndpoint(IStockService service)
    : Endpoint<
        StockSearchRequest,
        Results<Ok<List<StockSearchResponse>>, ProblemDetails>,
        StockSearchMapper
    >
{
    public override void Configure()
    {
        Get("/api/stocks/search");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(1))));
    }

    public override async Task<Results<Ok<List<StockSearchResponse>>, ProblemDetails>> ExecuteAsync(
        StockSearchRequest req,
        CancellationToken ct
    )
    {
        try
        { var dbStocks = await service.SearchStocksAsync(req.Query, req.Limit, ct);
            var stocks = Map.FromEntity(dbStocks);
            return TypedResults.Ok(stocks);
        }
        catch
        {
            AddError("An error occurred while retrieving stocks.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
