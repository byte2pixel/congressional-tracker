namespace CongressionalTradingTracker.Domain;

public class Ticker
{
    public int TickerId { get; set; }
    public required string Symbol { get; set; }
    public string? Company { get; set; }
    public string? TickerType { get; set; }
}
