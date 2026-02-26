namespace CongressionalTradingTracker.Domain;

public class Politician
{
    public int PoliticianId { get; set; }
    public required string Name { get; set; }

    /// <summary>Senate / House</summary>
    public required string CurrentPosition { get; set; }

    /// <summary>Unique congressional bioguide identifier (e.g. "P000197").</summary>
    public string? BioGuideId { get; set; }

    /// <summary>Current party affiliation (R / D / I).</summary>
    public string? Party { get; set; }

    /// <summary>US state the politician represents.</summary>
    public string? State { get; set; }
}
