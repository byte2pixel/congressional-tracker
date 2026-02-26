using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.Infrastructure;

public class SyncStateService(TradeDbContext dbContext) : ISyncStateService
{
    public async Task<bool> IsBulkSyncCompletedAsync(CancellationToken ct = default)
    {
        var state = await GetOrCreateAsync(ct);
        return state.BulkSyncCompleted;
    }

    public async Task MarkBulkSyncCompletedAsync(CancellationToken ct = default)
    {
        var state = await GetOrCreateAsync(ct);
        state.BulkSyncCompleted = true;
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateLastLiveSyncAsync(CancellationToken ct = default)
    {
        var state = await GetOrCreateAsync(ct);
        state.LastLiveSyncAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(ct);
    }

    private async Task<SyncState> GetOrCreateAsync(CancellationToken ct)
    {
        var state = await dbContext.SyncStates.FirstOrDefaultAsync(ct);
        if (state is null)
        {
            state = new SyncState { BulkSyncCompleted = false };
            dbContext.SyncStates.Add(state);
            await dbContext.SaveChangesAsync(ct);
        }
        return state;
    }
}
