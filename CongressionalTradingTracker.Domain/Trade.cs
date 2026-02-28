namespace CongressionalTradingTracker.Domain;

public class Trade
{
    public int TradeId { get; set; }

    // Foreign keys
    public int PoliticianId { get; set; }
    public Politician Politician { get; set; } = null!;

    public int TickerId { get; set; }
    public Ticker Ticker { get; set; } = null!;

    // Core trade fields
    public DateTime TransactionDate { get; set; }
    public DateTime ReportDate { get; set; }
    public required string Transaction { get; set; } // "Purchase" / "Sale"
    public required string RawAmount { get; set; } // Original amount string from the API (e.g. "1001.0", "Over $50,000,000")
    public string? RawRange { get; set; } // Original range string from the API (e.g. "1001-15000", "Over 1,000,000")
    public decimal RangeMin { get; set; } // Parsed minimum value of Range (e.g. 1001)
    public decimal? RangeMax { get; set; } // Parsed maximum value of Range (e.g. 15000); null means open-ended or unknown
    public decimal? RangeMid { get; set; } // Average of RangeMin and RangeMax; null when upper bound is unknown
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string? Comments { get; set; }
    public string? SubHolding { get; set; }

    // Politician metadata stored at time of trade
    public required string Party { get; set; }
    public required string House { get; set; } // Senate / House
    public string? District { get; set; }

    // Performance metrics (may be null until calculated)
    public decimal? ExcessReturn { get; set; }
    public decimal? PriceChange { get; set; }
    public decimal? SpyChange { get; set; }

    // Auditing fields
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
