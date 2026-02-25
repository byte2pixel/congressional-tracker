using FastEndpoints;

namespace CongressionalTradingTracker.BackgroundTasks;

public class CongressTradingProvider : IJobStorageProvider<JobRecord>
{
    public Task StoreJobAsync(JobRecord r, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<JobRecord>> GetNextBatchAsync(
        PendingJobSearchParams<JobRecord> parameters
    )
    {
        throw new NotImplementedException();
    }

    public Task MarkJobAsCompleteAsync(JobRecord r, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task CancelJobAsync(Guid trackingId, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task OnHandlerExecutionFailureAsync(
        JobRecord r,
        Exception exception,
        CancellationToken ct
    )
    {
        throw new NotImplementedException();
    }

    public Task PurgeStaleJobsAsync(StaleJobSearchParams<JobRecord> parameters)
    {
        throw new NotImplementedException();
    }
}
