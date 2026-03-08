namespace CongressionalTradingTracker.Core;

public interface IFinnhubService
{
    public Task<FinnhubSymbolLookup> LookupSymbolAsync(
        string query,
        CancellationToken ct = default
    );
}
