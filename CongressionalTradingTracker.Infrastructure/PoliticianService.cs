using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.Infrastructure;

public class PoliticianService(TradeDbContext dbContext) : IPoliticianService
{
    public Task<Politician[]> GetAllPoliticiansAsync(CancellationToken ct)
    {
        return dbContext.Politicians.ToArrayAsync(ct);
    }
}
