namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianSearchResponse
{
    public required string Name { get; set; }
    public required string House { get; set; }
    public string? Party { get; set; }
    public string BioGuideId { get; set; }
}
