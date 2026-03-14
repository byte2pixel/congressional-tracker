namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianTradesByBioGuideIdEndpoint(IPoliticianService service)
    : Endpoint<
        PoliticianTradesByBioGuideIdRequest,
        Results<Ok<List<PoliticianTradeByBioGuideIdResponse>>, ProblemDetails>,
        PoliticianGetTradesByBioGuideIdMapper
    >
{
    public override void Configure()
    {
        Get("/api/politicians/{BioGuideId}/trades");
        Roles("api-role");
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<
        Results<Ok<List<PoliticianTradeByBioGuideIdResponse>>, ProblemDetails>
    > ExecuteAsync(PoliticianTradesByBioGuideIdRequest request, CancellationToken ct)
    {
        try
        {
            var p = await service.GetPoliticianTradesByBioGuideIdAsync(request.BioGuideId, ct);
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
