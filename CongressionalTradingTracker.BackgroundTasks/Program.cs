using System.Net.Http.Headers;
using CongressionalTradingTracker.BackgroundTasks;
using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Infrastructure;
using CongressionalTradingTracker.Infrastructure.ApiCongressGov;
using DotNetEnv;
using DotNetEnv.Configuration;

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddDotNetEnv(".env", LoadOptions.TraversePath());
builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<TradeDbContext>("CongressTradingDb");
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddLogging();

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
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Token", apiKey);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddHttpClient<IFinnhubService, FinnhubService>(client =>
{
    var baseUrl =
        builder.Configuration["Finnhub:BaseUrl"]
        ?? throw new InvalidOperationException("Finnhub:BaseUrl is not configured.");
    var apiKey =
        builder.Configuration["Finnhub:ApiKey"]
        ?? throw new InvalidOperationException("Finnhub:ApiKey is not configured.");

    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromMinutes(5);
    client.DefaultRequestHeaders.Add("X-Finnhub-Token", apiKey);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddHttpClient<ICongressGovService, CongressGovService>(client =>
{
    var apiKey = builder.Configuration["CongressGov:ApiKey"];
    client.DefaultRequestHeaders.Add("X-Api-Key", apiKey);
});

builder.Services.AddHostedService<Worker>();

var host = builder.Build();

await host.RunAsync();
