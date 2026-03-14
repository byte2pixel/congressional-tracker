namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianByBioGuideIdResponse
{
    public required string Name { get; set; }
    public required string House { get; set; }
    public string? Party { get; set; }
    public required string BioGuideId { get; set; }
    public required string State { get; set; }
    public required string District { get; set; }
}
