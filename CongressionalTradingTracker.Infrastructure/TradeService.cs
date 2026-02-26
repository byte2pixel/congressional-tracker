using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace CongressionalTradingTracker.Infrastructure;

public class TradeService(TradeDbContext dbContext) : ITradeService
{
    public async Task UpsertTradesAsync(
        IEnumerable<CongressTradeDto> trades,
        CancellationToken ct = default
    )
    {
        // Cache lookups to avoid repeated DB round-trips per batch
        var politicianCache = new Dictionary<string, Politician>(StringComparer.OrdinalIgnoreCase);
        var stockCache = new Dictionary<string, Stock>(StringComparer.OrdinalIgnoreCase);

        foreach (var dto in trades)
        {
            if (
                string.IsNullOrWhiteSpace(dto.PoliticianName)
                || string.IsNullOrWhiteSpace(dto.Ticker)
            )
                continue;

            var politician = await GetOrCreatePoliticianAsync(dto, politicianCache, ct);
            var stock = await GetOrCreateStockAsync(dto, stockCache, ct);

            var exists = await dbContext.Trades.AnyAsync(
                t =>
                    t.PoliticianId == politician.PoliticianId
                    && t.StockId == stock.StockId
                    && t.TransactionDate == dto.EffectiveTransactionDate
                    && t.Transaction == dto.Transaction,
                ct
            );

            if (exists)
                continue;

            dbContext.Trades.Add(
                new Trade
                {
                    PoliticianId = politician.PoliticianId,
                    StockId = stock.StockId,
                    TransactionDate = dto.EffectiveTransactionDate,
                    ReportDate = dto.EffectiveReportDate,
                    Transaction = dto.Transaction,
                    Range = dto.Range ?? dto.TradeSizeUsd,
                    Amount = dto.EffectiveAmount,
                    Party = dto.Party,
                    House = dto.ChamberName,
                    District = dto.District,
                    TickerType = dto.TickerType,
                    Description = dto.Description,
                    ExcessReturn = dto.ExcessReturn,
                    PriceChange = dto.PriceChange,
                    SpyChange = dto.SPYChange,
                }
            );
        }

        await dbContext.SaveChangesAsync(ct);
    }

    private async Task<Politician> GetOrCreatePoliticianAsync(
        CongressTradeDto dto,
        Dictionary<string, Politician> cache,
        CancellationToken ct
    )
    {
        var name = dto.PoliticianName;
        if (cache.TryGetValue(name, out var cached))
            return cached;

        var politician = await dbContext.Politicians.FirstOrDefaultAsync(p => p.Name == name, ct);

        if (politician is null)
        {
            politician = new Politician { Name = name, CurrentPosition = dto.ChamberName };
            dbContext.Politicians.Add(politician);
            await dbContext.SaveChangesAsync(ct);
        }

        cache[name] = politician;
        return politician;
    }

    private async Task<Stock> GetOrCreateStockAsync(
        CongressTradeDto dto,
        Dictionary<string, Stock> cache,
        CancellationToken ct
    )
    {
        var symbol = dto.Ticker;
        if (cache.TryGetValue(symbol, out var cached))
            return cached;

        var stock = await dbContext.Stocks.FirstOrDefaultAsync(s => s.Symbol == symbol, ct);

        if (stock is null)
        {
            stock = new Stock { Symbol = symbol };
            dbContext.Stocks.Add(stock);
            await dbContext.SaveChangesAsync(ct);
        }

        cache[symbol] = stock;
        return stock;
    }
}
