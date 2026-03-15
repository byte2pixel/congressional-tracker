using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.Infrastructure;

public class PoliticianService(TradeDbContext dbContext) : IPoliticianService
{
    public Task<Politician[]> SearchPoliticians(string query, int limit, CancellationToken ct)
    {
        return dbContext
            .Politicians.Where(p => EF.Functions.ILike(p.Name, $"%{query}%"))
            .Take(limit)
            .ToArrayAsync(ct);
    }

    public Task<Politician?> GetPolitician(string bioGuideId, CancellationToken ct)
    {
        return dbContext.Politicians.Where(p => p.BioGuideId == bioGuideId).FirstOrDefaultAsync(ct);
    }

    public Task<Politician?> GetPoliticianTrades(string bioGuideId, CancellationToken ct)
    {
        return dbContext
            .Politicians.Include(p => p.Trades)
                .ThenInclude(t => t.Ticker)
            .Where(p => p.BioGuideId == bioGuideId)
            .FirstOrDefaultAsync(ct);
    }
}
