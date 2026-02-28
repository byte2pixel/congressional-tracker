using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class CongressBulkDto
{
    // Trade metadata
    [JsonPropertyName("Filed")]
    public DateTime? ReportDate { get; set; }

    [JsonPropertyName("Traded")]
    public DateTime? Traded { get; set; }

    [JsonPropertyName("Transaction")]
    public string Transaction { get; set; }

    [JsonPropertyName("Status")]
    public string? Status { get; set; }

    [JsonPropertyName("Trade_Size_USD")]
    public string Amount { get; set; } = "0";

    [JsonPropertyName("excess_return")]
    public string ExcessReturn { get; set; }

    [JsonPropertyName("Subholding")]
    public string? SubHolding { get; set; }

    [JsonPropertyName("Description")]
    public string? Description { get; set; }

    [JsonPropertyName("Comments")]
    public string? Comments { get; set; }

    // Ticker metadata stored at time of trade
    [JsonPropertyName("Ticker")]
    public string Symbol { get; set; } = string.Empty;

    [JsonPropertyName("TickerType")]
    public string? TickerType { get; set; } = string.Empty;

    [JsonPropertyName("Company")]
    public string? Company { get; set; }

    // Politician metadata stored at time of trade
    [JsonPropertyName("Name")]
    public string Name { get; set; }

    [JsonPropertyName("BioGuideID")]
    public string BioGuideId { get; set; }

    [JsonPropertyName("Party")]
    public string Party { get; set; }

    [JsonPropertyName("District")]
    public string? District { get; set; }

    [JsonPropertyName("Chamber")]
    public string House { get; set; }

    [JsonPropertyName("State")]
    public string? State { get; set; }

    [JsonPropertyName("last_modified")]
    public DateTime? LastModified { get; set; }

    [JsonPropertyName("Quiver_Upload_Time")]
    public string? QuiverUploadTime { get; set; }

    public bool HasValidDates => Traded.HasValue && ReportDate.HasValue;

    public DateTime EffectiveTransactionDate =>
        DateTime.SpecifyKind(Traded!.Value, DateTimeKind.Utc);

    public DateTime EffectiveReportDate =>
        DateTime.SpecifyKind(ReportDate!.Value, DateTimeKind.Utc);

    public DateTime EffectiveLastModified
    {
        get
        {
            var lastModified = DateTime.SpecifyKind(
                LastModified ?? ReportDate ?? DateTime.UtcNow,
                DateTimeKind.Utc
            );
            return DateTime.Compare(DateTime.UtcNow, lastModified) > 0
                ? lastModified
                : DateTime.UtcNow;
        }
    }

    public Decimal EffectiveAmount
    {
        get
        {
            return decimal.TryParse(
                Amount,
                System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture,
                out var result
            )
                ? result
                : 0;
        }
    }

    public decimal EffectiveExcessReturn
    {
        get
        {
            return decimal.TryParse(
                ExcessReturn,
                System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture,
                out var result
            )
                ? result
                : 0;
        }
    }
}
