using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface IPoliticianService
{
    public Task<Politician[]> SearchPoliticians(string query, int limit, CancellationToken ct);
    public Task<Politician?> GetPolitician(string bioGuideId, CancellationToken ct);
    public Task<Politician?> GetPoliticianTrades(string bioGuideId, CancellationToken ct);
}
