// Aspire AppHost for CongressionalTradingTracker Application
// This file sets up the distributed application services and their dependencies.

IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

// Configure postgres database with pgAdmin and persistent data volume
var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume(isReadOnly: false)
    .WithPgAdmin(a => a.WithHostPort(5050));

// Add the main database for the application
var postgresdb = postgres.AddDatabase("CongressTradingDb");

// Add migration service to handle database schema updates
var migrations = builder
    .AddProject<Projects.CongressionalTradingTracker_MigrationService>("migrations")
    .WithReference(postgresdb)
    .WaitFor(postgresdb);

// Configure Redis cache service with redis-commander and persistent data volume
var cache = builder.AddRedis("cache").WithRedisCommander().WithDataVolume(isReadOnly: false);

// Configure the API service with dependencies on the database, cache, and migrations
var apiService = builder
    .AddProject<Projects.CongressionalTradingTracker_ApiService>("apiservice")
    .WithReference(cache)
    .WithReference(postgresdb)
    .WithReference(migrations)
    .WaitForCompletion(migrations)
    .WithHttpHealthCheck("/health");

// Configure the frontend service with a reference to the API service
var frontend = builder.AddViteApp("frontend", "../frontend").WithReference(apiService);

// Run the distributed application
await builder.Build().RunAsync();
