namespace CongressionalTradingTracker.Core;

public interface IFinnhubService
{
    public Task<SymbolLookup> GetSymbolAsync(string query, CancellationToken ct = default);

    public Task<CompanyProfile?> GetCompanyProfile(string symbol, CancellationToken ct = default);
}
