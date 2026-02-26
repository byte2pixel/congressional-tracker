using System.Net.Http.Json;
using System.Text.Json;
using CongressionalTradingTracker.Core;

namespace CongressionalTradingTracker.Infrastructure;

public class QuiverQuantService(HttpClient client) : IQuiverQuantService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public async Task<IReadOnlyList<CongressTradeDto>> GetBulkTradesAsync(
        CancellationToken ct = default
    )
    {
        var result = await client.GetFromJsonAsync<List<CongressTradeDto>>(
            "beta/bulk/congresstrading",
            JsonOptions,
            ct
        );
        return result ?? [];
    }

    public async Task<IReadOnlyList<CongressTradeDto>> GetLiveTradesAsync(
        CancellationToken ct = default
    )
    {
        var result = await client.GetFromJsonAsync<List<CongressTradeDto>>(
            "beta/live/congresstrading",
            JsonOptions,
            ct
        );
        return result ?? [];
    }
}
