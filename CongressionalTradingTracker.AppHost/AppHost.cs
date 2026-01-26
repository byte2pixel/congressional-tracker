IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);
var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume(isReadOnly: false)
    .WithPgAdmin(a => a.WithHostPort(5050));
var postgresdb = postgres.AddDatabase("CongressTradingDb");
var migrations = builder
    .AddProject<Projects.CongressionalTradingTracker_MigrationService>("migrations")
    .WithReference(postgresdb)
    .WaitFor(postgresdb);
var apiService = builder
    .AddProject<Projects.CongressionalTradingTracker_ApiService>("apiservice")
    .WithReference(postgresdb)
    .WithReference(migrations)
    .WaitForCompletion(migrations)
    .WithHttpHealthCheck("/health");

var frontend = builder.AddViteApp("frontend", "../frontend").WithReference(apiService);

await builder.Build().RunAsync();
