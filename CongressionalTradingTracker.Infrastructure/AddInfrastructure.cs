using CongressionalTradingTracker.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CongressionalTradingTracker.Infrastructure;

public static class InfrastructureExtension
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddHttpClient<IQuiverQuantService, QuiverQuantService>(client =>
        {
            var baseUrl =
                configuration["QuiverQuant:BaseUrl"]
                ?? throw new InvalidOperationException("QuiverQuant:BaseUrl is not configured.");
            var apiKey =
                configuration["QuiverQuant:ApiKey"]
                ?? throw new InvalidOperationException("QuiverQuant:ApiKey is not configured.");
            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Token", apiKey);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        });

        services.AddScoped<IStockService, StockService>();
        services.AddScoped<IPoliticianService, PoliticianService>();
        services.AddScoped<ITradeService, TradeService>();
        services.AddScoped<ISyncStateService, SyncStateService>();

        return services;
    }
}
