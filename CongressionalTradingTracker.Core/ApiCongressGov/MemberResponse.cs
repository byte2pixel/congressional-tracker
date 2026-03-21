using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

public class MemberResponse
{
    [JsonPropertyName("members")]
    public ICollection<Member> Members { get; set; }

    [JsonPropertyName("pagination")]
    public Pagination Pagination { get; set; }
}

public class Pagination
{
    /// <summary>
    /// The total number of items in the result set. This is not the number of items returned in this response, but the total number of items that match the query.
    /// </summary>
    [JsonPropertyName("count")]
    public int Count { get; set; }

    /// <summary>
    /// This is the full url. example:
    /// "prev": "https://api.congress.gov/v3/member?currentMember=true&offset=0&limit=250&format=json"
    /// </summary>
    [JsonPropertyName("prev")]
    public string? Previous { get; set; }

    /// <summary>
    /// This is the full url example:
    /// https://api.congress.gov/v3/member?currentMember=true&offset=250&limit=250&format=json
    /// </summary>
    [JsonPropertyName("next")]
    public string? Next { get; set; }
}
