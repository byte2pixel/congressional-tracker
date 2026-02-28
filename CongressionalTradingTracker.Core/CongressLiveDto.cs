using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class CongressLiveDto
{
    // Trade metadata
    [JsonPropertyName("ReportDate")]
    public DateTime ReportDate { get; set; }

    [JsonPropertyName("TransactionDate")]
    public DateTime TransactionDate { get; set; }

    [JsonPropertyName("Transaction")]
    public string Transaction { get; init; } = string.Empty;

    [JsonPropertyName("Range")]
    public string RawRange { get; init; } = string.Empty;

    [JsonPropertyName("Amount")]
    public string Amount { get; init; } = string.Empty;

    [JsonPropertyName("Description")]
    public string? Description { get; init; }

    [JsonPropertyName("ExcessReturn")]
    public decimal? ExcessReturn { get; init; }

    [JsonPropertyName("PriceChange")]
    public decimal? PriceChange { get; init; }

    [JsonPropertyName("SPYChange")]
    public decimal? SpyChange { get; init; }

    [JsonPropertyName("last_modified")]
    public DateTime LastModified { get; init; }

    // Ticker metadata stored at time of trade
    [JsonPropertyName("TickerType")]
    public string TickerType { get; init; } = string.Empty;

    [JsonPropertyName("Ticker")]
    public string Symbol { get; init; } = string.Empty;

    // Politician metadata stored at time of trade
    [JsonPropertyName("Representative")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("BioGuideID")]
    public string BioGuideId { get; init; } = string.Empty;

    [JsonPropertyName("House")]
    public string House { get; init; } = string.Empty;

    [JsonPropertyName("Party")]
    public string Party { get; init; } = string.Empty;
}
