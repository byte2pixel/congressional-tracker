using CongressionalTradingTracker.BackgroundTasks;
using FastEndpoints;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();
builder.Services.AddJobQueues<JobRecord, CongressTradingProvider>();

var host = builder.Build();

host.UseJobQueues();

await host.RunAsync();
