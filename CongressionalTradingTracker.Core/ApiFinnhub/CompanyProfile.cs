using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class CompanyProfile
{
    [JsonPropertyName("country")]
    public string? Country { get; init; }

    [JsonPropertyName("currency")]
    public string? Currency { get; init; }

    [JsonPropertyName("estimateCurrency")]
    public string? EstimateCurrency { get; init; }

    [JsonPropertyName("exchange")]
    public string Exchange { get; init; } = "Other";

    [JsonPropertyName("finnhubIndustry")]
    public string Industry { get; init; } = "Other";

    [JsonPropertyName("ipo")]
    public string? Ipo { get; init; }

    [JsonPropertyName("logo")]
    public string? Logo { get; init; }

    [JsonPropertyName("weburl")]
    public string? Website { get; init; }

    [JsonPropertyName("name")]
    public required string Name { get; init; }

    [JsonPropertyName("ticker")]
    public required string Ticker { get; init; }

    [JsonPropertyName("marketCapitalization")]
    public required Decimal MarketCap { get; init; }

    [JsonPropertyName("shareOutstanding")]
    public required Decimal ShareOutstanding { get; init; }

    [JsonPropertyName("phone")]
    public string? Phone { get; init; }
}
