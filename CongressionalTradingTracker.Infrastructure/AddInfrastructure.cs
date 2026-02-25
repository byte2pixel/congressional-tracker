using CongressionalTradingTracker.ApiService.Services;
using CongressionalTradingTracker.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CongressionalTradingTracker.Infrastructure;

public static class AddInfrastructure
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddTransient<IQuiverQuantService, QuiverQuantService>();
        // TODO: Add other infrastructure services here
        return services;
    }
}
