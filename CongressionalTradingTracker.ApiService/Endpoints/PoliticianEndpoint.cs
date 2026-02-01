using CongressionalTradingTracker.ApiService.Data;
using CongressionalTradingTracker.ApiService.Dtos;
using CongressionalTradingTracker.ApiService.Mappers;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.ApiService.Endpoints;

public class PoliticianEndpoint(TradeDbContext dbContext)
    : EndpointWithoutRequest<
        Results<Ok<List<PoliticianResponse>>, ProblemDetails>,
        PoliticianMapper
    >
{
    public override void Configure()
    {
        Get("/api/politicians");
        AllowAnonymous();
        ResponseCache(60);
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<Results<Ok<List<PoliticianResponse>>, ProblemDetails>> ExecuteAsync(
        CancellationToken ct
    )
    {
        try
        {
            var dbPoliticians = await dbContext.Politicians.ToArrayAsync(ct);
            var politicians = Map.FromEntity(dbPoliticians);
            return TypedResults.Ok(politicians);
        }
        catch
        {
            AddError("An error occurred while retrieving politicians.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
