using CongressionalTradingTracker.ApiService.Data;
using CongressionalTradingTracker.MigrationService;

var builder = Host.CreateApplicationBuilder(args);
builder.AddServiceDefaults();
builder.Services.AddHostedService<Worker>();

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(Worker.ActivitySourceName));
builder.AddNpgsqlDbContext<TradeDbContext>("CongressTradingDb");

var host = builder.Build();
await host.RunAsync();
