using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace CongressionalTradingTracker.Core;

/// <summary>
/// Handles date strings from the QuiverQuant API (e.g. "2025-06-30").
/// Registered globally on JsonSerializerOptions so it covers both DateTime and DateTime?.
/// </summary>
public class ApiDateTimeConverter : JsonConverter<DateTime>
{
    private static readonly string[] Formats =
    [
        "yyyy-MM-dd",
        "yyyy-MM-ddTHH:mm:ss",
        "yyyy-MM-ddTHH:mm:ssZ",
        "MM/dd/yyyy HH:mm:ss",
        "MM/dd/yyyy",
    ];

    public override DateTime Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options
    )
    {
        var str = reader.GetString();
        if (!string.IsNullOrWhiteSpace(str))
        {
            if (
                DateTime.TryParseExact(
                    str,
                    Formats,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out var result
                )
            )
                return result;
            if (
                DateTime.TryParse(
                    str,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out result
                )
            )
                return result;
        }
        return default;
    }

    public override void Write(
        Utf8JsonWriter writer,
        DateTime value,
        JsonSerializerOptions options
    ) => writer.WriteStringValue(value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
}

/// <summary>
/// Nullable wrapper — delegates to ApiDateTimeConverter, returns null for null/empty tokens.
/// </summary>
public class NullableDateTimeConverter : JsonConverter<DateTime?>
{
    private static readonly ApiDateTimeConverter Inner = new();

    public override DateTime? Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options
    )
    {
        if (reader.TokenType == JsonTokenType.Null)
            return null;

        var str = reader.GetString();
        if (string.IsNullOrWhiteSpace(str))
            return null;

        return Inner.Read(ref reader, typeof(DateTime), options);
    }

    public override void Write(
        Utf8JsonWriter writer,
        DateTime? value,
        JsonSerializerOptions options
    )
    {
        if (value.HasValue)
            Inner.Write(writer, value.Value, options);
        else
            writer.WriteNullValue();
    }
}
