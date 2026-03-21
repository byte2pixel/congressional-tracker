using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class Depiction
{
    [JsonPropertyName("attribution")]
    public string? Attribution { get; set; }

    [JsonPropertyName("imageUrl")]
    public required string ImageUrl { get; set; }
}
