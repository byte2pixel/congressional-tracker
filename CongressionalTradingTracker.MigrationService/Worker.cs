using System.Diagnostics;
using CongressionalTradingTracker.ApiService.Data;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

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
            // Get all migrations defined in the assembly
            var allMigrations = dbContext.Database.GetMigrations();

            // Get pending migrations (ones not yet applied)
            var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync(
                cancellationToken
            );

            // If all migrations are pending, it's a fresh database
            var isNewDatabase = allMigrations.Count() == pendingMigrations.Count();

            await dbContext.Database.MigrateAsync(cancellationToken);
            return isNewDatabase;
        });
        return wasCreated;
    }

    private static async Task SeedDataAsync(
        TradeDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        Stock firstStock = new() { Symbol = "AAPL" };
        Politician firstPolitician = new() { Name = "John Doe", CurrentPosition = "Senator" };

        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Seed the database
            await using var transaction = await dbContext.Database.BeginTransactionAsync(
                cancellationToken
            );
            await dbContext.Stocks.AddAsync(firstStock, cancellationToken);
            await dbContext.Politicians.AddAsync(firstPolitician, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        });
    }
}
