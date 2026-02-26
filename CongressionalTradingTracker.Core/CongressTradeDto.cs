using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

/// <summary>
/// Represents a single congressional trade record returned by both the
/// /live/congresstrading and /bulk/congresstrading endpoints.
/// </summary>
public class CongressTradeDto
{
    // Shared fields
    [JsonPropertyName("Ticker")]
    public string Ticker { get; init; } = string.Empty;

    [JsonPropertyName("TickerType")]
    public string? TickerType { get; init; }

    [JsonPropertyName("Transaction")]
    public string Transaction { get; init; } = string.Empty;

    [JsonPropertyName("Party")]
    public string Party { get; init; } = string.Empty;

    [JsonPropertyName("District")]
    public string? District { get; init; }

    [JsonPropertyName("Description")]
    public string? Description { get; init; }

    // ── Live endpoint fields ──────────────────────────────────────────────────
    [JsonPropertyName("Representative")]
    public string? Representative { get; init; }

    [JsonPropertyName("BioGuideID")]
    public string? BioGuideID { get; init; }

    [JsonPropertyName("ReportDate")]
    public DateTime? ReportDate { get; init; }

    [JsonPropertyName("TransactionDate")]
    public DateTime? TransactionDate { get; init; }

    [JsonPropertyName("Range")]
    public string? Range { get; init; }

    [JsonPropertyName("House")]
    public string? House { get; init; }

    [JsonPropertyName("Amount")]
    public int? Amount { get; init; }

    [JsonPropertyName("ExcessReturn")]
    public decimal? ExcessReturn { get; init; }

    [JsonPropertyName("PriceChange")]
    public decimal? PriceChange { get; init; }

    [JsonPropertyName("SPYChange")]
    public decimal? SPYChange { get; init; }

    // ── Bulk endpoint fields ──────────────────────────────────────────────────
    /// <summary>Politician name – bulk API uses "Name", live uses "Representative".</summary>
    [JsonPropertyName("Name")]
    public string? Name { get; init; }

    /// <summary>Transaction date – bulk API uses "Traded".</summary>
    [JsonPropertyName("Traded")]
    public DateTime? Traded { get; init; }

    /// <summary>Report/filed date – bulk API uses "Filed".</summary>
    [JsonPropertyName("Filed")]
    public DateTime? Filed { get; init; }

    /// <summary>Trade size string – bulk API uses "Trade_Size_USD" instead of Amount.</summary>
    [JsonPropertyName("Trade_Size_USD")]
    public string? TradeSizeUsd { get; init; }

    /// <summary>Chamber (Senate/House) – bulk API uses "Chamber" instead of "House".</summary>
    [JsonPropertyName("Chamber")]
    public string? Chamber { get; init; }

    // ── Convenience accessors ─────────────────────────────────────────────────
    public string PoliticianName => Representative ?? Name ?? string.Empty;
    public string ChamberName => House ?? Chamber ?? string.Empty;
    public DateTime EffectiveTransactionDate => TransactionDate ?? Traded ?? DateTime.MinValue;
    public DateTime EffectiveReportDate => ReportDate ?? Filed ?? DateTime.MinValue;

    /// <summary>
    /// Parses a mid-point USD amount from either the numeric Amount field
    /// or the bulk "Trade_Size_USD" string (e.g. "$1,001 - $15,000").
    /// </summary>
    public int EffectiveAmount
    {
        get
        {
            if (Amount.HasValue)
                return Amount.Value;

            if (string.IsNullOrWhiteSpace(TradeSizeUsd))
                return 0;

            // "$1,001 - $15,000" → take midpoint of the two numbers
            var parts = TradeSizeUsd.Split('-');
            if (
                parts.Length == 2
                && TryParseUsd(parts[0], out var lo)
                && TryParseUsd(parts[1], out var hi)
            )
                return (int)((lo + hi) / 2m);

            // Single value
            return TryParseUsd(TradeSizeUsd, out var single) ? (int)single : 0;
        }
    }

    private static bool TryParseUsd(string s, out decimal value)
    {
        var clean = s.Trim().TrimStart('$').Replace(",", "");
        return decimal.TryParse(clean, out value);
    }
}
