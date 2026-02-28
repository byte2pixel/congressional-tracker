using CongressionalTradingTracker.Core;
using CongressionalTradingTracker.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CongressionalTradingTracker.Infrastructure;

public class TradeService(TradeDbContext dbContext, ILogger<TradeService> logger) : ITradeService
{
    public async Task UpsertBulkTradesAsync(
        IEnumerable<CongressBulkDto> trades,
        CancellationToken ct = default
    )
    {
        var dtoList = trades
            .Where(d => !string.IsNullOrWhiteSpace(d.Name) && !string.IsNullOrWhiteSpace(d.Symbol))
            .ToList();

        var missingDates = dtoList.Count(d => !d.HasValidDates);
        if (missingDates > 0)
            logger.LogWarning(
                "{Count} records skipped due to missing TransactionDate or ReportDate.",
                missingDates
            );

        dtoList = dtoList.Where(d => d.HasValidDates).ToList();

        if (dtoList.Count == 0)
            return;

        // ── 1. Resolve politicians ────────────────────────────────────────────
        var bioGuideIds = dtoList
            .Select(d => d.BioGuideId)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var politicianCache = await dbContext
            .Politicians.Where(p => p.BioGuideId != null && bioGuideIds.Contains(p.BioGuideId))
            .ToDictionaryAsync(p => p.BioGuideId!, StringComparer.OrdinalIgnoreCase, ct);

        var newBioGuideIds = bioGuideIds
            .Where(id => !politicianCache.ContainsKey(id))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var bioGuideId in newBioGuideIds)
        {
            var dto = dtoList.First(d =>
                d.BioGuideId.Equals(bioGuideId, StringComparison.OrdinalIgnoreCase)
            );
            var politician = new Politician
            {
                Name = bioGuideId,
                BioGuideId = dto.BioGuideId,
                Party = dto.Party,
                District = dto.District,
                House = dto.House,
                State = dto.State,
                CreatedAt = dto.EffectiveLastModified,
                UpdatedAt = dto.EffectiveLastModified,
            };
            dbContext.Politicians.Add(politician);
            politicianCache[bioGuideId] = politician;
        }

        await dbContext.SaveChangesAsync(ct); // flush new politicians (PKs are now populated)

        // Update pre-existing politicians with any newly available fields (skip just-inserted ones)
        foreach (var dto in dtoList)
        {
            if (newBioGuideIds.Contains(dto.BioGuideId))
                continue; // just inserted with correct data, nothing to update

            var politician = politicianCache[dto.BioGuideId];
            var dirty = false;

            if (politician.BioGuideId is null)
            {
                politician.BioGuideId = dto.BioGuideId;
                dirty = true;
            }
            if (politician.House != dto.House)
            {
                politician.House = dto.House;
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
            if (politician.District is null && dto.District is not null)
            {
                politician.District = dto.District;
                dirty = true;
            }

            if (dirty)
                politician.UpdatedAt = DateTime.UtcNow;
        }

        // ── 2. Resolve tickers ───────────────────────────────────────────────
        var symbols = dtoList
            .Select(d => d.Symbol)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var stockCache = await dbContext
            .Stocks.Where(s => symbols.Contains(s.Symbol))
            .ToDictionaryAsync(s => s.Symbol, StringComparer.OrdinalIgnoreCase, ct);

        var newSymbols = symbols
            .Where(s => !stockCache.ContainsKey(s))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var symbol in newSymbols)
        {
            var dto = dtoList.First(d =>
                d.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase)
            );
            var ticker = new Ticker
            {
                Symbol = symbol,
                Company = dto.Company,
                TickerType = dto.TickerType,
            };
            dbContext.Stocks.Add(ticker);
            stockCache[symbol] = ticker;
        }

        // Update pre-existing tickers with any newly available fields (skip just-inserted ones)
        foreach (var dto in dtoList)
        {
            if (newSymbols.Contains(dto.Symbol))
                continue; // just inserted with correct data, nothing to update

            var ticker = stockCache[dto.Symbol];
            if (ticker.Company is null && dto.Company is not null)
                ticker.Company = dto.Company;
            if (ticker.TickerType is null && dto.TickerType is not null)
                ticker.TickerType = dto.TickerType;
        }

        await dbContext.SaveChangesAsync(ct); // flush new tickers + any politician/ticker updates

        // ── 3. Deduplicate within the batch and against the DB ───────────────
        // Build candidate trades, deduplicating by the natural key within the batch first.
        var pendingKeys =
            new HashSet<(
                int PoliticianId,
                int TickerId,
                DateTime TransactionDate,
                DateTime ReportDate,
                string Transaction,
                string RawAmount,
                string? SubHolding
            )>();
        var candidateTrades = new List<Trade>();

        var skippedNullBioGuide = 0;
        var skippedNullSymbol = 0;
        var skippedDuplicateInBatch = 0;
        // For duplicate keys within the batch, keep the one with the latest LastModified
        // (so the most up-to-date ExcessReturn wins).
        var keyToDto =
            new Dictionary<
                (int, int, DateTime, DateTime, string, string, string?),
                CongressBulkDto
            >();

        foreach (var dto in dtoList)
        {
            if (!politicianCache.TryGetValue(dto.BioGuideId, out var politician))
            {
                skippedNullBioGuide++;
                continue;
            }
            if (!stockCache.TryGetValue(dto.Symbol, out var stock))
            {
                skippedNullSymbol++;
                continue;
            }

            var key = (
                politician.PoliticianId,
                stock.TickerId,
                dto.EffectiveTransactionDate,
                dto.EffectiveReportDate,
                dto.Transaction,
                dto.Amount,
                dto.SubHolding
            );

            if (keyToDto.TryGetValue(key, out var existing))
            {
                skippedDuplicateInBatch++;
                // Keep whichever has the later LastModified (most recent ExcessReturn)
                if (dto.EffectiveLastModified > existing.EffectiveLastModified)
                    keyToDto[key] = dto;
                continue;
            }

            keyToDto[key] = dto;
            pendingKeys.Add(key);
        }

        foreach (var (key, dto) in keyToDto)
        {
            var range = TradeServiceHelper.ParseRange(dto.Amount, logger);
            candidateTrades.Add(
                new Trade
                {
                    PoliticianId = key.Item1,
                    TickerId = key.Item2,
                    TransactionDate = key.Item3,
                    ReportDate = key.Item4,
                    Transaction = key.Item5,
                    RawAmount = dto.Amount,
                    RangeMin = range.min,
                    RangeMax = range.max,
                    RangeMid = range.mid,
                    Amount = dto.EffectiveAmount,
                    Party = dto.Party,
                    House = dto.House,
                    District = dto.District,
                    Description = dto.Description,
                    Comments = dto.Comments,
                    SubHolding = dto.SubHolding,
                    ExcessReturn = dto.EffectiveExcessReturn,
                    PriceChange = null,
                    SpyChange = null,
                    CreatedAt = dto.EffectiveTransactionDate,
                    UpdatedAt = dto.EffectiveLastModified,
                }
            );
        }

        logger.LogInformation(
            "Trade batch: {Total} raw, {Candidates} candidates after dedup, {DupInBatch} duplicates within batch, {NullBio} missing bioguide, {NullSymbol} missing symbol.",
            dtoList.Count,
            candidateTrades.Count,
            skippedDuplicateInBatch,
            skippedNullBioGuide,
            skippedNullSymbol
        );

        // ── 4. Check which candidates already exist in the DB ────────────────
        // Query only the natural keys present in this batch to avoid a broad cross-product filter.
        var candidateKeys = pendingKeys.ToList();
        var candidatePoliticianIds = candidateKeys.Select(k => k.PoliticianId).Distinct().ToList();
        var candidateTickerIds = candidateKeys.Select(k => k.TickerId).Distinct().ToList();

        var existingTrades = await dbContext
            .Trades.Where(t =>
                candidatePoliticianIds.Contains(t.PoliticianId)
                && candidateTickerIds.Contains(t.TickerId)
            )
            .ToListAsync(ct);

        var existingByKey = existingTrades.ToDictionary(t =>
            (
                t.PoliticianId,
                t.TickerId,
                t.TransactionDate,
                t.ReportDate,
                t.Transaction,
                t.RawAmount,
                t.SubHolding
            )
        );

        var existingKeySet = existingByKey.Keys.ToHashSet();

        var newTrades = candidateTrades
            .Where(t =>
                !existingKeySet.Contains(
                    (
                        t.PoliticianId,
                        t.TickerId,
                        t.TransactionDate,
                        t.ReportDate,
                        t.Transaction,
                        t.RawAmount,
                        t.SubHolding
                    )
                )
            )
            .ToList();

        var updatedCount = 0;
        foreach (
            var candidate in candidateTrades.Where(t =>
                existingKeySet.Contains(
                    (
                        t.PoliticianId,
                        t.TickerId,
                        t.TransactionDate,
                        t.ReportDate,
                        t.Transaction,
                        t.RawAmount,
                        t.SubHolding
                    )
                )
            )
        )
        {
            var key = (
                candidate.PoliticianId,
                candidate.TickerId,
                candidate.TransactionDate,
                candidate.ReportDate,
                candidate.Transaction,
                candidate.RawAmount,
                candidate.SubHolding
            );
            if (!existingByKey.TryGetValue(key, out var existing))
                continue;

            if (
                existing.ExcessReturn != candidate.ExcessReturn
                || existing.UpdatedAt < candidate.UpdatedAt
            )
            {
                existing.ExcessReturn = candidate.ExcessReturn;
                existing.UpdatedAt = candidate.UpdatedAt;
                updatedCount++;
            }
        }

        logger.LogInformation(
            "{ExistingInDb} already exist in DB ({Updated} updated), inserting {New} new trades.",
            existingByKey.Count,
            updatedCount,
            newTrades.Count
        );

        // ── 5. Insert all new trades in one batch ────────────────────────────
        dbContext.Trades.AddRange(newTrades);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpsertLiveTradesAsync(
        IEnumerable<CongressLiveDto> trades,
        CancellationToken ct = default
    )
    {
        var dtoList = trades
            .Where(d => !string.IsNullOrWhiteSpace(d.Name) && !string.IsNullOrWhiteSpace(d.Symbol))
            .ToList();

        if (dtoList.Count == 0)
            return;

        // ── 1. Resolve politicians ────────────────────────────────────────────
        var bioGuideIds = dtoList
            .Select(d => d.BioGuideId)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var politicianCache = await dbContext
            .Politicians.Where(p => p.BioGuideId != null && bioGuideIds.Contains(p.BioGuideId))
            .ToDictionaryAsync(p => p.BioGuideId!, StringComparer.OrdinalIgnoreCase, ct);

        var newBioGuideIds = bioGuideIds
            .Where(id => !politicianCache.ContainsKey(id))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var bioGuideId in newBioGuideIds)
        {
            var dto = dtoList.First(d =>
                d.BioGuideId.Equals(bioGuideId, StringComparison.OrdinalIgnoreCase)
            );
            var politician = new Politician
            {
                Name = dto.Name,
                BioGuideId = dto.BioGuideId,
                Party = dto.Party,
                House = dto.House,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            dbContext.Politicians.Add(politician);
            politicianCache[bioGuideId] = politician;
        }

        await dbContext.SaveChangesAsync(ct);

        // Update pre-existing politicians with any newly available fields
        foreach (var dto in dtoList)
        {
            if (newBioGuideIds.Contains(dto.BioGuideId))
                continue;

            var politician = politicianCache[dto.BioGuideId];
            var dirty = false;

            if (politician.House != dto.House)
            {
                politician.House = dto.House;
                dirty = true;
            }
            if (politician.Party is null && !string.IsNullOrWhiteSpace(dto.Party))
            {
                politician.Party = dto.Party;
                dirty = true;
            }

            if (dirty)
                politician.UpdatedAt = DateTime.UtcNow;
        }

        // ── 2. Resolve tickers ───────────────────────────────────────────────
        var symbols = dtoList
            .Select(d => d.Symbol)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var stockCache = await dbContext
            .Stocks.Where(s => symbols.Contains(s.Symbol))
            .ToDictionaryAsync(s => s.Symbol, StringComparer.OrdinalIgnoreCase, ct);

        var newSymbols = symbols
            .Where(s => !stockCache.ContainsKey(s))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var symbol in newSymbols)
        {
            var dto = dtoList.First(d =>
                d.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase)
            );
            var ticker = new Ticker { Symbol = symbol, TickerType = dto.TickerType };
            dbContext.Stocks.Add(ticker);
            stockCache[symbol] = ticker;
        }

        foreach (var dto in dtoList)
        {
            if (newSymbols.Contains(dto.Symbol))
                continue;

            var ticker = stockCache[dto.Symbol];
            if (ticker.TickerType is null && !string.IsNullOrWhiteSpace(dto.TickerType))
                ticker.TickerType = dto.TickerType;
        }

        await dbContext.SaveChangesAsync(ct);

        // ── 3. Deduplicate within the batch ──────────────────────────────────
        // Live payload has no SubHolding — use null as the natural key component.
        var keyToDto =
            new Dictionary<
                (
                    int PoliticianId,
                    int TickerId,
                    DateTime TransactionDate,
                    DateTime ReportDate,
                    string Transaction,
                    string RawAmount
                ),
                CongressLiveDto
            >();

        var skippedDuplicateInBatch = 0;

        foreach (var dto in dtoList)
        {
            if (!politicianCache.TryGetValue(dto.BioGuideId, out var politician))
                continue;
            if (!stockCache.TryGetValue(dto.Symbol, out var stock))
                continue;

            var key = (
                politician.PoliticianId,
                stock.TickerId,
                dto.TransactionDate,
                dto.ReportDate,
                dto.Transaction,
                dto.Amount
            );

            if (keyToDto.TryGetValue(key, out var existing))
            {
                skippedDuplicateInBatch++;
                // Keep the record with the latest last_modified
                if (dto.LastModified > existing.LastModified)
                    keyToDto[key] = dto;
                continue;
            }

            keyToDto[key] = dto;
        }

        // ── 4. Build candidate trades ─────────────────────────────────────────
        var candidateTrades = new List<Trade>();
        foreach (var (key, dto) in keyToDto)
        {
            var range = TradeServiceHelper.ParseRange(dto.Amount, logger);
            candidateTrades.Add(
                new Trade
                {
                    PoliticianId = key.PoliticianId,
                    TickerId = key.TickerId,
                    TransactionDate = key.TransactionDate,
                    ReportDate = key.ReportDate,
                    Transaction = key.Transaction,
                    RawAmount = dto.Amount,
                    RawRange = dto.RawRange,
                    RangeMin = range.min,
                    RangeMax = range.max,
                    RangeMid = range.mid,
                    Amount = range.mid ?? range.min,
                    Party = dto.Party,
                    House = dto.House,
                    Description = dto.Description,
                    ExcessReturn = dto.ExcessReturn,
                    PriceChange = dto.PriceChange,
                    SpyChange = dto.SpyChange,
                    CreatedAt = key.TransactionDate,
                    UpdatedAt = dto.LastModified,
                }
            );
        }

        logger.LogInformation(
            "Live trade batch: {Total} raw, {Candidates} candidates after dedup, {DupInBatch} duplicates within batch.",
            dtoList.Count,
            candidateTrades.Count,
            skippedDuplicateInBatch
        );

        // ── 5. Diff against DB — insert new, update performance metrics ───────
        var candidatePoliticianIds = candidateTrades
            .Select(t => t.PoliticianId)
            .Distinct()
            .ToList();
        var candidateTickerIds = candidateTrades.Select(t => t.TickerId).Distinct().ToList();

        var existingTrades = await dbContext
            .Trades.Where(t =>
                candidatePoliticianIds.Contains(t.PoliticianId)
                && candidateTickerIds.Contains(t.TickerId)
            )
            .ToListAsync(ct);

        var existingByKey = existingTrades.ToDictionary(t =>
            (
                t.PoliticianId,
                t.TickerId,
                t.TransactionDate,
                t.ReportDate,
                t.Transaction,
                t.RawAmount
            )
        );

        var newTrades = new List<Trade>();
        var updatedCount = 0;

        foreach (var candidate in candidateTrades)
        {
            var key = (
                candidate.PoliticianId,
                candidate.TickerId,
                candidate.TransactionDate,
                candidate.ReportDate,
                candidate.Transaction,
                candidate.RawAmount
            );

            if (existingByKey.TryGetValue(key, out var existing))
            {
                // Update performance metrics if the live data is more recent
                if (candidate.UpdatedAt >= existing.UpdatedAt)
                {
                    var dirty = false;
                    if (existing.ExcessReturn != candidate.ExcessReturn)
                    {
                        existing.ExcessReturn = candidate.ExcessReturn;
                        dirty = true;
                    }
                    if (existing.PriceChange != candidate.PriceChange)
                    {
                        existing.PriceChange = candidate.PriceChange;
                        dirty = true;
                    }
                    if (existing.SpyChange != candidate.SpyChange)
                    {
                        existing.SpyChange = candidate.SpyChange;
                        dirty = true;
                    }
                    if (dirty)
                    {
                        existing.UpdatedAt = candidate.UpdatedAt;
                        updatedCount++;
                    }
                }
            }
            else
            {
                newTrades.Add(candidate);
            }
        }

        logger.LogInformation(
            "{ExistingInDb} already exist in DB ({Updated} updated), inserting {New} new live trades.",
            existingByKey.Count,
            updatedCount,
            newTrades.Count
        );

        dbContext.Trades.AddRange(newTrades);
        await dbContext.SaveChangesAsync(ct);
    }
}

public static class TradeServiceHelper
{
    // Range Lookup table
    // $1,001 - $15,000 => 1001 to 15000
    // $15,001 - $50,000 => 15001 to 50000
    // $50,001 - $100,000 => 50001 to 100000
    // $100,001 - $250,000 => 100001 to 250000
    // $250,001 - $500,000 => 250001 to 500000
    // $500,001 - $1,000,000 => 500001 to 1000000
    // $1,000,001 - $5,000,000 => 1000001 to 5000000
    // $5,000,001 - $25,000,000 => 5000001 to 25000000
    // $25,000,001 - $50,000,000 => 25000001 to 50000000
    // $50,000,001+ => 50000001 to decimal.MaxValue
    static readonly Dictionary<string, (decimal min, decimal? max)> RangeLookup = new()
    {
        { "1001.0", (1001, 15000) },
        { "15001.0", (15001, 50000) },
        { "50001.0", (50001, 100000) },
        { "100001.0", (100001, 250000) },
        { "250001.0", (250001, 500000) },
        { "500001.0", (500001, 1000000) },
        { "1000001.0", (1000001, 5000000) },
        { "5000001.0", (5000001, 25000000) },
        { "25000001.0", (25000001, 50000000) },
        { "50000001.0", (50000001, null) },
        { "Over $50,000,000", (50000001, null) },
    };

    public static (decimal min, decimal? max, decimal? mid) ParseRange(
        string amount,
        ILogger? logger = null
    )
    {
        if (!RangeLookup.TryGetValue(amount, out (decimal min, decimal? max) value))
        {
            if (
                decimal.TryParse(
                    amount,
                    System.Globalization.NumberStyles.Any,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out var parsed
                )
            )
            {
                return (parsed, parsed, parsed);
            }

            // Unrecognised descriptive string — store what we can and move on
            logger?.LogWarning(
                "Unrecognised trade amount string '{Amount}'; range will be stored as unknown.",
                amount
            );
            return (0, null, null);
        }

        var mid = value.max.HasValue ? (value.min + value.max.Value) / 2 : (decimal?)null;
        return (value.min, value.max, mid);
    }
}
