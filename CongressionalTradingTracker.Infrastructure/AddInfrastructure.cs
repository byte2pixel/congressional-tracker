using CongressionalTradingTracker.ApiService.Services;
using CongressionalTradingTracker.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CongressionalTradingTracker.Infrastructure;

public static class InfrastructureExtension
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddTransient<IQuiverQuantService, QuiverQuantService>();
        services.AddScoped<IStockService, StockService>();
        services.AddScoped<IPoliticianService, PoliticianService>();
        return services;
    }
}
