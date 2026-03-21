using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class Member
{
    [JsonPropertyName("bioGuideId")]
    public required string BioGuideId { get; set; }

    [JsonPropertyName("depiction")]
    public required Depiction Depiction { get; set; }

    [JsonPropertyName("partyName")]
    public required string PartyName { get; set; }

    [JsonPropertyName("state")]
    public required string State { get; set; }

    [JsonPropertyName("district")]
    public int? District { get; set; }

    [JsonPropertyName("terms")]
    public required Terms Terms { get; set; }
}
