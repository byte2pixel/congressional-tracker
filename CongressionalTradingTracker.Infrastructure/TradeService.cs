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

        // Track keys already queued in this batch to avoid duplicate change-tracker entries
        // before SaveChangesAsync flushes them to the DB.
        var pendingKeys =
            new HashSet<(
                int PoliticianId,
                int StockId,
                DateTime TransactionDate,
                string Transaction,
                string? Range
            )>();

        foreach (var dto in trades)
        {
            if (
                string.IsNullOrWhiteSpace(dto.PoliticianName)
                || string.IsNullOrWhiteSpace(dto.Ticker)
            )
                continue;

            var politician = await GetOrCreatePoliticianAsync(dto, politicianCache, ct);
            var stock = await GetOrCreateStockAsync(dto, stockCache, ct);

            var range = dto.Range ?? dto.TradeSizeUsd;
            var key = (
                politician.PoliticianId,
                stock.StockId,
                dto.EffectiveTransactionDate,
                dto.Transaction,
                range
            );

            if (pendingKeys.Contains(key))
                continue;

            var exists = await dbContext.Trades.AnyAsync(
                t =>
                    t.PoliticianId == politician.PoliticianId
                    && t.StockId == stock.StockId
                    && t.TransactionDate == dto.EffectiveTransactionDate
                    && t.Transaction == dto.Transaction
                    && t.Range == range,
                ct
            );

            if (exists)
                continue;

            pendingKeys.Add(key);

            dbContext.Trades.Add(
                new Trade
                {
                    PoliticianId = politician.PoliticianId,
                    StockId = stock.StockId,
                    TransactionDate = dto.EffectiveTransactionDate,
                    ReportDate = dto.EffectiveReportDate,
                    Transaction = dto.Transaction,
                    Range = range,
                    Amount = dto.EffectiveAmount,
                    Party = dto.Party,
                    House = dto.ChamberName,
                    District = dto.District,
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
            politician = new Politician
            {
                Name = name,
                CurrentPosition = dto.ChamberName,
                BioGuideId = dto.BioGuideID,
                Party = dto.Party,
                State = dto.State,
            };
            dbContext.Politicians.Add(politician);
            await dbContext.SaveChangesAsync(ct);
        }
        else
        {
            // Fill in fields that may not have been available when the record was first created
            var dirty = false;
            if (politician.BioGuideId is null && dto.BioGuideID is not null)
            {
                politician.BioGuideId = dto.BioGuideID;
                dirty = true;
            }
            if (politician.Party is null && dto.Party is not null)
            {
                politician.Party = dto.Party;
                dirty = true;
            }
            if (politician.State is null && dto.State is not null)
            {
                politician.State = dto.State;
                dirty = true;
            }
            if (dirty)
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
            stock = new Stock
            {
                Symbol = symbol,
                Company = dto.Company,
                TickerType = dto.TickerType,
            };
            dbContext.Stocks.Add(stock);
            await dbContext.SaveChangesAsync(ct);
        }
        else
        {
            // Fill in fields that may not have been available when the record was first created
            var dirty = false;
            if (stock.Company is null && dto.Company is not null)
            {
                stock.Company = dto.Company;
                dirty = true;
            }
            if (stock.TickerType is null && dto.TickerType is not null)
            {
                stock.TickerType = dto.TickerType;
                dirty = true;
            }
            if (dirty)
                await dbContext.SaveChangesAsync(ct);
        }

        cache[symbol] = stock;
        return stock;
    }
}
