namespace CongressionalTradingTracker.Domain;

public class SyncState
{
    public int SyncStateId { get; set; }
    public bool BulkSyncCompleted { get; set; }
    public DateTime? LastLiveSyncAt { get; set; }
}
