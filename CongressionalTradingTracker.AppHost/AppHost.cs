IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume(isReadOnly: false)
    .WithPgAdmin(a => a.WithHostPort(5050));
var postgresdb = postgres.AddDatabase("CongressTradingDb");

var apiService = builder
    .AddProject<Projects.CongressionalTradingTracker_ApiService>("apiservice")
    .WithReference(postgresdb)
    .WaitFor(postgresdb)
    .WithHttpHealthCheck("/health");

var frontend = builder.AddViteApp("frontend", "../frontend");

await builder.Build().RunAsync();
