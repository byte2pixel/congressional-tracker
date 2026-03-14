using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface IPoliticianService
{
    public Task<Politician[]> SearchPoliticiansAsync(string query, int limit, CancellationToken ct);
    public Task<Politician?> GetPoliticianByBioGuideIdAsync(
        string bioGuideId,
        CancellationToken ct
    );
    public Task<Politician?> GetPoliticianTradesByBioGuideIdAsync(
        string bioGuideId,
        CancellationToken ct
    );
}
