namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetPoliticianEndpoint(IPoliticianService service)
    : Endpoint<
        GetPoliticianRequest,
        Results<Ok<GetPoliticianResponse>, ProblemDetails>,
        GetPoliticianMapper
    >
{
    public override void Configure()
    {
        Get("/api/politician/{BioGuideId}");
        AllowAnonymous();
        Options(x => x.CacheOutput(p => p.Expire(TimeSpan.FromMinutes(60))));
    }

    public override async Task<Results<Ok<GetPoliticianResponse>, ProblemDetails>> ExecuteAsync(
        GetPoliticianRequest req,
        CancellationToken ct
    )
    {
        try
        {
            var dbPolitician = await service.GetPolitician(req.BioGuideId, ct);
            if (dbPolitician != null)
            {
                return TypedResults.Ok(Map.FromEntity(dbPolitician));
            }

            AddError("Politician not found.");
            return new ProblemDetails(ValidationFailures);
        }
        catch (Exception ex)
        {
            Logger.LogError(
                ex,
                "Error retrieving politician with BioGuideId {BioGuideId}",
                req.BioGuideId
            );
            AddError("An error occurred while retrieving the politician.");
            return new ProblemDetails(ValidationFailures);
        }
    }
}
