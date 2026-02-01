using CongressionalTradingTracker.ApiService.Data;
using CongressionalTradingTracker.ApiService.Dtos;
using CongressionalTradingTracker.ApiService.Mappers;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.ApiService.Endpoints;

public class StockEndpoint(TradeDbContext dbContext)
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
            var dbStocks = await dbContext.Stocks.ToArrayAsync(ct);
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
