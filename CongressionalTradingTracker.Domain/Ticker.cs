namespace CongressionalTradingTracker.Domain;

public class Ticker
{
    public int TickerId { get; set; }
    public required string Symbol { get; set; }
    public string? Company { get; set; }
    public string? TickerType { get; set; }
    public string? Website { get; set; }
    public string? Logo { get; set; }
    public required string Industry { get; set; }
    public required string Exchange { get; set; }

    // EF Core navigation property
    public ICollection<Trade> Trades { get; set; } = [];
}
