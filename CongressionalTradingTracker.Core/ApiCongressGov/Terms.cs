using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class Terms
{
    [JsonPropertyName("item")]
    public ICollection<TermItem> Items { get; set; } = [];
}

public class TermItem
{
    public required string Chamber { get; set; }
    public int StartYear { get; set; }
    public int? EndYear { get; set; }
}
