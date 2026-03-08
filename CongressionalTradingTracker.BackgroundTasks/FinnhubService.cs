using System.Net.Http.Json;
using System.Text.Json;
using CongressionalTradingTracker.Core;

namespace CongressionalTradingTracker.BackgroundTasks;

public class FinnhubService(HttpClient client) : IFinnhubService
{
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public async Task<FinnhubSymbolLookup> LookupSymbolAsync(
        string query,
        CancellationToken ct = default
    )
    {
        if (string.IsNullOrWhiteSpace(query) || query.Trim().Length < 1)
            return new FinnhubSymbolLookup();

        try
        {
            var result = await client.GetFromJsonAsync<FinnhubSymbolLookup>(
                $"search?q={Uri.EscapeDataString(query.Trim())}",
                JsonOptions,
                ct
            );
            return result ?? new FinnhubSymbolLookup();
        }
        catch (HttpRequestException ex) when ((int?)ex.StatusCode is 422 or 400)
        {
            // Finnhub rejects the query (e.g. unsupported characters) — treat as no results.
            return new FinnhubSymbolLookup();
        }
    }
}
