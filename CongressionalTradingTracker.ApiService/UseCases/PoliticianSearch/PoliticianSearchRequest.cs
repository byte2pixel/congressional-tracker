namespace CongressionalTradingTracker.ApiService.UseCases;

public class PoliticianSearchRequest
{
    public string Query { get; init; } = string.Empty;

    public int Limit { get; init; } = 10;
}
