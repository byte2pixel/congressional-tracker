namespace CongressionalTradingTracker.Domain;

public class Trade
{
    public int TradeId { get; set; }

    // Foreign keys
    public int PoliticianId { get; set; }
    public Politician Politician { get; set; } = null!;

    public int StockId { get; set; }
    public Stock Stock { get; set; } = null!;

    // Core trade fields
    public DateTime TransactionDate { get; set; }
    public DateTime ReportDate { get; set; }
    public required string Transaction { get; set; } // "Purchase" / "Sale"
    public string? Range { get; set; } // e.g. "$1,001 - $15,000"
    public int Amount { get; set; }

    // Politician metadata stored at time of trade
    public required string Party { get; set; }
    public required string House { get; set; } // Senate / House
    public string? District { get; set; }

    // Asset metadata
    public string? Description { get; set; }

    // Performance metrics (may be null until calculated)
    public decimal? ExcessReturn { get; set; }
    public decimal? PriceChange { get; set; }
    public decimal? SpyChange { get; set; }
}
