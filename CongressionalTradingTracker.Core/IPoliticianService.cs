using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface IPoliticianService
{
    public Task<Politician[]> SearchPoliticiansAsync(string query, int limit, CancellationToken ct);
}
