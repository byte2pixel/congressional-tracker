namespace CongressionalTradingTracker.Core;

public interface ICongressGovService
{
    /// <summary>
    /// Get all the members.
    /// Congress.gov limits 250 per request to implementation
    /// should internally handle pagination and return all members.
    /// </summary>
    public Task<ICollection<Member>> GetAllMembers(CancellationToken ct = default);
}
