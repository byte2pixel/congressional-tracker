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
        services.AddScoped<IStockService, StockService>();
        services.AddScoped<IPoliticianService, PoliticianService>();
        services.AddScoped<ITradeService, TradeService>();
        services.AddScoped<ISyncStateService, SyncStateService>();

        return services;
    }
}
