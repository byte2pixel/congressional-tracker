using CongressionalTradingTracker.ApiService.Dtos;
using CongressionalTradingTracker.ApiService.Mappers;
using CongressionalTradingTracker.Core;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CongressionalTradingTracker.ApiService.Endpoints;

public class PoliticianEndpoint(IPoliticianService service)
    : EndpointWithoutRequest<
        Results<Ok<List<PoliticianResponse>>, ProblemDetails>,
        PoliticianMapper
    >
{
    public override void Configure()
    {
        Get("/api/politicians");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<Results<Ok<List<PoliticianResponse>>, ProblemDetails>> ExecuteAsync(
        CancellationToken ct
    )
    {
        try
        {
            var dbPoliticians = await service.GetAllPoliticiansAsync(ct);
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
