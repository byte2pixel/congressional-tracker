using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

namespace CongressionalTradingTracker.ApiService;

public class ClaimsTransformation : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        var identity = (ClaimsIdentity)principal.Identity!;

        var realmAccessClaim = identity.FindFirst("realm_access");
        if (realmAccessClaim == null)
        {
            return Task.FromResult(principal);
        }

        var realmAccess = JsonDocument.Parse(realmAccessClaim.Value);
        if (!realmAccess.RootElement.TryGetProperty("roles", out var roles))
        {
            return Task.FromResult(principal);
        }

        foreach (
            string? roleValue in roles
                .EnumerateArray()
                .Select(role => role.GetString())
                .OfType<string>()
                .Where(roleValue => !identity.HasClaim(ClaimTypes.Role, roleValue))
        )
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, roleValue));
        }

        return Task.FromResult(principal);
    }
}
