namespace CongressionalTradingTracker.Core;

public interface ISyncStateService
{
    Task<bool> IsBulkSyncCompletedAsync(CancellationToken ct = default);
    Task MarkBulkSyncCompletedAsync(CancellationToken ct = default);
    Task UpdateLastLiveSyncAsync(CancellationToken ct = default);
}
