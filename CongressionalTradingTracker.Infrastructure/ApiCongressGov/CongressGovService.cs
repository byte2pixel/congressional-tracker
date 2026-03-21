using System.Net.Http.Json;
using System.Text.Json;
using CongressionalTradingTracker.Core;
using Microsoft.Extensions.Logging;

namespace CongressionalTradingTracker.Infrastructure.ApiCongressGov;

public class CongressGovService(HttpClient client) : ICongressGovService
{
    public const string BaseAddress = "https://api.congress.gov/v3";
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public async Task<ICollection<Member>> GetAllMembers(CancellationToken ct = default)
    {
        const int limit = 250;
        List<Member> result = [];
        // https://api.congress.gov/v3/member?format=json&offset=250&limit=250&currentMember=true
        // build query params currentMember always true, offset 0, limit 250 for first requesty
        // then use the Next from the pagination property on the response.
        string? nextUrl =
            $"{BaseAddress}/member?format=json&offset=0&limit={limit}&currentMember=true";
        while (!string.IsNullOrEmpty(nextUrl))
        {
            MemberResponse? response = await client.GetFromJsonAsync<MemberResponse>(
                nextUrl,
                JsonOptions,
                ct
            );
            if (response != null)
            {
                result.AddRange(response.Members);
            }
            nextUrl = response?.Pagination.Next;
        }
        return result;
    }
}
