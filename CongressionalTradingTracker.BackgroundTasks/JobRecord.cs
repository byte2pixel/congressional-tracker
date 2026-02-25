using FastEndpoints;

namespace CongressionalTradingTracker.BackgroundTasks;

public sealed class JobRecord : IJobStorageRecord
{
    public string QueueID { get; set; }
    public Guid TrackingID { get; set; }
    public object Command { get; set; }
    public DateTime ExecuteAfter { get; set; }
    public DateTime ExpireOn { get; set; }
    public bool IsComplete { get; set; }
}
