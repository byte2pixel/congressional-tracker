using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class SymbolLookup
{
    [JsonPropertyName("count")]
    public int Count { get; init; }

    [JsonPropertyName("result")]
    public IReadOnlyList<SymbolInfo> Result { get; init; } = [];
}
