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
    public required string BioGuideId { get; init; }

    [JsonPropertyName("House")]
    public string House { get; init; } = string.Empty;

    [JsonPropertyName("Party")]
    public string Party { get; init; } = string.Empty;

    // specify utc time zone but all the current time zone hours to it so that we can compare with current utc time and determine if the trade is new or not
    public DateTime EffectiveTransactionDate =>
        DateTime.SpecifyKind(TransactionDate + TimeToAddFromHours(), DateTimeKind.Utc);

    private static TimeSpan TimeToAddFromHours()
    {
        return TimeSpan.FromHours(Math.Abs(TimeZoneInfo.Local.GetUtcOffset(DateTime.UtcNow).Hours));
    }

    public DateTime EffectiveReportDate =>
        DateTime.SpecifyKind(ReportDate + TimeToAddFromHours(), DateTimeKind.Utc);

    public DateTime EffectiveLastModified
    {
        get
        {
            var lastModified = DateTime.SpecifyKind(
                LastModified + TimeToAddFromHours(),
                DateTimeKind.Utc
            );
            return DateTime.Compare(DateTime.UtcNow, lastModified) > 0
                ? lastModified
                : DateTime.UtcNow;
        }
    }
}
