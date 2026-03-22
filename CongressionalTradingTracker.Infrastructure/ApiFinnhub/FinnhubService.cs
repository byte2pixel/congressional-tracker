using System.Net.Http.Json;
using System.Text.Json;
using CongressionalTradingTracker.Core;

namespace CongressionalTradingTracker.Infrastructure;

public class FinnhubService(HttpClient client) : IFinnhubService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public async Task<SymbolLookup> GetSymbolAsync(string query, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Trim().Length < 1)
            return new SymbolLookup();

        try
        {
            var result = await client.GetFromJsonAsync<SymbolLookup>(
                $"search?q={Uri.EscapeDataString(query.Trim())}",
                JsonOptions,
                ct
            );
            return result ?? new SymbolLookup();
        }
        catch (HttpRequestException ex) when ((int?)ex.StatusCode is 422 or 400)
        {
            // Finnhub rejects the query (e.g. unsupported characters) — treat as no results.
            return new SymbolLookup();
        }
    }

    public async Task<CompanyProfile?> GetCompanyProfile(
        string symbol,
        CancellationToken ct = default
    )
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(symbol);
        try
        {
            // returns `{}` with 200 OK if symbol not found, so we can just attempt deserialization without checking status code first
            var response = await client.GetAsync(
                $"stock/profile2?symbol={Uri.EscapeDataString(symbol.Trim())}",
                ct
            );
            CompanyProfile? profile = null;
            if (response.IsSuccessStatusCode)
            {
                var contentStream = await response.Content.ReadAsStreamAsync(ct);
                profile = await JsonSerializer.DeserializeAsync<CompanyProfile>(
                    contentStream,
                    JsonOptions,
                    ct
                );
            }

            return profile;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching company profile for symbol '{symbol}'");
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return null;
        }
    }
}
