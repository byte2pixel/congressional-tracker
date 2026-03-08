using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class FinnhubSymbolLookup
{
    [JsonPropertyName("count")]
    public int Count { get; init; }

    [JsonPropertyName("result")]
    public IReadOnlyList<FinnhubSymbol> Result { get; init; } = [];
}
