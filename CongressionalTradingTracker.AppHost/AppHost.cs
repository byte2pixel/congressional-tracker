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

// Add a background worker service for scheduled tasks
var worker = builder
    .AddProject<Projects.CongressionalTradingTracker_BackgroundTasks>("worker")
    .WithReference(postgresdb)
    .WithReference(migrations)
    .WaitForCompletion(migrations);

var keycloak = builder.AddKeycloak("keycloak", 8080).WithDataVolume().WithOtlpExporter();

// Configure Redis cache service with redis-commander and persistent data volume
var cache = builder
    .AddRedis("cache")
    .WithDataVolume(isReadOnly: false)
    .WithPersistence(interval: TimeSpan.FromMinutes(1), keysChangedThreshold: 1)
    .WithRedisInsight();

// Configure the API service with dependencies on the database, cache, and migrations
var apiService = builder
    .AddProject<Projects.CongressionalTradingTracker_ApiService>("apiservice")
    .WithReference(keycloak)
    .WithReference(cache)
    .WithReference(postgresdb)
    .WithReference(migrations)
    .WaitFor(keycloak)
    .WaitForCompletion(migrations)
    .WithHttpHealthCheck("/health");

// Configure the frontend service with a reference to the API service
var frontend = builder
    .AddViteApp("frontend", "../frontend")
    .WithReference(keycloak)
    .WithReference(apiService)
    .WaitFor(apiService);

// Run the distributed application
await builder.Build().RunAsync();
