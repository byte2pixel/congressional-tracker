using CongressionalTradingTracker.Core;

namespace CongressionalTradingTracker.BackgroundTasks;

public class Worker(
    ILogger<Worker> logger,
    IServiceScopeFactory scopeFactory,
    IConfiguration configuration
) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var intervalMinutes = configuration.GetValue("QuiverQuant:LiveSyncIntervalMinutes", 60);
        var timer = new PeriodicTimer(TimeSpan.FromMinutes(intervalMinutes));

        // Ensure bulk sync runs immediately without waiting for the first timer tick
        await RunSyncAsync(stoppingToken);

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await RunSyncAsync(stoppingToken);
        }
    }

    private async Task RunSyncAsync(CancellationToken ct)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var quiverQuant = scope.ServiceProvider.GetRequiredService<IQuiverQuantService>();
        var finnhub = scope.ServiceProvider.GetRequiredService<IFinnhubService>();
        var congressGov = scope.ServiceProvider.GetRequiredService<ICongressGovService>();
        var tradeService = scope.ServiceProvider.GetRequiredService<ITradeService>();
        var syncState = scope.ServiceProvider.GetRequiredService<ISyncStateService>();

        try
        {
            var bulkCompleted = await syncState.IsBulkSyncCompletedAsync(ct);

            if (!bulkCompleted)
            {
                logger.LogInformation("Starting one-time bulk congressional trades sync...");
                var bulkTrades = await quiverQuant.GetBulkTradesAsync(ct);
                await tradeService.UpsertBulkTrades(bulkTrades, finnhub, congressGov, ct);
                await syncState.MarkBulkSyncCompletedAsync(ct);
                logger.LogInformation(
                    "Bulk sync completed. Fetched and upserted {Count} trades.",
                    bulkTrades.Count
                );
            }
            else
            {
                var lastSync = await syncState.GetLastLiveSyncAsync(ct);
                if (lastSync.HasValue && lastSync.Value.Date == DateTime.UtcNow.Date)
                {
                    logger.LogInformation(
                        "Live sync already completed today ({Date:yyyy-MM-dd}). Skipping.",
                        lastSync.Value.Date
                    );
                    return;
                }

                logger.LogInformation("Fetching live congressional trades...");
                var liveTrades = await quiverQuant.GetLiveTradesAsync(ct);
                await tradeService.UpsertLiveTrades(liveTrades, finnhub, congressGov, ct);
                await syncState.UpdateLastLiveSyncAsync(ct);
                logger.LogInformation(
                    "Live sync completed. Fetched and upserted {Count} trades.",
                    liveTrades.Count
                );
            }
        }
        catch (Exception ex) when (!ct.IsCancellationRequested)
        {
            logger.LogError(ex, "Error during congressional trades sync.");
        }
    }
}
