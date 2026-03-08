using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class FinnhubSymbol
{
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("displaySymbol")]
    public string DisplaySymbol { get; set; } = string.Empty;

    [JsonPropertyName("symbol")]
    public string Symbol { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
}
