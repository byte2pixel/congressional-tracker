using CongressionalTradingTracker.BackgroundTasks;
using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Infrastructure;
using DotNetEnv;
using DotNetEnv.Configuration;

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddDotNetEnv(".env", LoadOptions.TraversePath());
builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<TradeDbContext>("CongressTradingDb");
builder.Services.AddInfrastructure(builder.Configuration);

// var timeoutSeconds = builder.Configuration.GetValue("QuiverQuant:TimeoutSeconds", 300);
// var timeout = TimeSpan.FromSeconds(timeoutSeconds);

builder.Services.AddHttpClient<IQuiverQuantService, QuiverQuantService>(client =>
{
    var baseUrl =
        builder.Configuration["QuiverQuant:BaseUrl"]
        ?? throw new InvalidOperationException("QuiverQuant:BaseUrl is not configured.");
    var apiKey =
        builder.Configuration["QuiverQuant:ApiKey"]
        ?? throw new InvalidOperationException("QuiverQuant:ApiKey is not configured.");

    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromMinutes(5);
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Token", apiKey);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});
builder.Services.AddHostedService<Worker>();

var host = builder.Build();

await host.RunAsync();
