namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetPoliticianTradesEndpoint(IPoliticianService service)
    : Endpoint<
        GetPoliticianTradesRequest,
        Results<Ok<List<GetPoliticianTradesResponse>>, ProblemDetails>,
        GetPoliticianTradesMapper
    >
{
    public override void Configure()
    {
        Get("/api/politician/{BioGuideId}/trades");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<
        Results<Ok<List<GetPoliticianTradesResponse>>, ProblemDetails>
    > ExecuteAsync(GetPoliticianTradesRequest request, CancellationToken ct)
    {
        try
        {
            var p = await service.GetPoliticianTrades(request.BioGuideId, ct);
            var response = await Map.FromEntityAsync(p?.Trades ?? [], ct);
            return TypedResults.Ok(response);
        }
        catch
        {
            AddError("An error occurred while retrieving trades for the specified politician.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
