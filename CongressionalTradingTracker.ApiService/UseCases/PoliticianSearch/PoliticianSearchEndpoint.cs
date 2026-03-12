namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianSearchEndpoint(IPoliticianService service)
    : Endpoint<
        PoliticianSearchRequest,
        Results<Ok<List<PoliticianSearchResponse>>, ProblemDetails>,
        PoliticianSearchMapper
    >
{
    public override void Configure()
    {
        Get("/api/politicians/search");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(1))));
    }

    public override async Task<
        Results<Ok<List<PoliticianSearchResponse>>, ProblemDetails>
    > ExecuteAsync(PoliticianSearchRequest req, CancellationToken ct)
    {
        try
        {
            var dbPoliticians = await service.SearchPoliticiansAsync(req.Query, req.Limit, ct);
            var politicians = Map.FromEntity(dbPoliticians);
            return TypedResults.Ok(politicians);
        }
        catch
        {
            AddError("An error occurred while searching for politicians.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
