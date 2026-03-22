namespace CongressionalTradingTracker.ApiService.UseCases;

public class GetStockMapper : ResponseMapper<GetStockResponse, Ticker>
{
    public override GetStockResponse FromEntity(Ticker e)
    {
        return new GetStockResponse()
        {
            Symbol = e.Symbol,
            Company = e.Company ?? "Unknown",
            Type = e.TickerType ?? "Unknown",
            Exchange = e.Exchange,
            Website = e.Website,
            Logo = e.Logo,
            Industry = e.Industry,
        };
    }
}
