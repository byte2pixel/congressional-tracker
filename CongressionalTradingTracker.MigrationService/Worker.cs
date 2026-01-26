using System.Diagnostics;
using CongressionalTradingTracker.ApiService.Data;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using OpenTelemetry.Trace;

namespace CongressionalTradingTracker.MigrationService;

public class Worker(
    IServiceProvider serviceProvider,
    IHostApplicationLifetime hostApplicationLifetime
) : BackgroundService
{
    public const string ActivitySourceName = "Migrations";
    private static readonly ActivitySource SActivitySource = new(ActivitySourceName);

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var activity = SActivitySource.StartActivity(
            "Migrating database",
            ActivityKind.Client
        );

        try
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TradeDbContext>();

            var wasCreated = await RunMigrationAsync(dbContext, cancellationToken);
            if (wasCreated)
                await SeedDataAsync(dbContext, cancellationToken);
        }
        catch (Exception ex)
        {
            activity?.AddException(ex);
            throw;
        }

        hostApplicationLifetime.StopApplication();
    }

    private static async Task<bool> RunMigrationAsync(
        TradeDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();
        var wasCreated = await strategy.ExecuteAsync(async () =>
        {
            // Run migration in a transaction to avoid partial migration if it fails.
            var exists = await dbContext.Database.CanConnectAsync(cancellationToken);
            await dbContext.Database.MigrateAsync(cancellationToken);
            return !exists;
        });
        return wasCreated;
    }

    private static async Task SeedDataAsync(
        TradeDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        Stock firstStock = new() { Symbol = "AAPL" };

        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Seed the database
            await using var transaction = await dbContext.Database.BeginTransactionAsync(
                cancellationToken
            );
            await dbContext.Stocks.AddAsync(firstStock, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        });
    }
}
