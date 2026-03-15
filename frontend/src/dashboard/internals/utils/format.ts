/**
 * format number as volume with suffixes (K, M, B)
 * @param value value to format
 * @param precision precision for decimal places (default: 1)
 * @returns a formatted string with appropriate suffix
 * @example
 * formatVolume(1500) // "$1.5K"
 * formatVolume(2500000) // "$2.5M"
 * formatVolume(3000000000) // "$3.0B"
 * formatVolume(500) // "$500"
 */
export function formatVolume(value: number, precision: number = 1): string {
  if (value >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(precision)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(precision)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(precision)}K`;
  return `$${value.toFixed(precision)}`;
}

export function formatParty(party: string): string {
  switch (party) {
    case "Democratic":
      return "Democrat";
    default:
      return party;
  }
}
