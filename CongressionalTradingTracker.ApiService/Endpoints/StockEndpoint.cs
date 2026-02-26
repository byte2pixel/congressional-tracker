using CongressionalTradingTracker.ApiService.Dtos;
using CongressionalTradingTracker.ApiService.Mappers;
using CongressionalTradingTracker.Core;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CongressionalTradingTracker.ApiService.Endpoints;

public class StockEndpoint(IStockService service)
    : EndpointWithoutRequest<Results<Ok<List<StockResponse>>, ProblemDetails>, StockMapper>
{
    public override void Configure()
    {
        Get("/api/stocks");
        AllowAnonymous();
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<Results<Ok<List<StockResponse>>, ProblemDetails>> ExecuteAsync(
        CancellationToken ct
    )
    {
        try
        {
            var dbStocks = await service.GetAllStocksAsync(ct);
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
