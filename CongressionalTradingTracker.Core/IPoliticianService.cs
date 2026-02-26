using CongressionalTradingTracker.Domain;

namespace CongressionalTradingTracker.Core;

public interface IPoliticianService
{
    public Task<Politician[]> GetAllPoliticiansAsync(CancellationToken ct);
}
