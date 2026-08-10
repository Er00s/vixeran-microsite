/**
 * Shared colour / size scale for every gain figure in the microsite.
 *
 * The trial map, the weather dashboard and the KPI badges all import from
 * here, so a change to the thresholds propagates everywhere at once.
 */

export interface GainBand {
  /** Inclusive lower bound in %. -Infinity for the first band. */
  min: number;
  color: string;
  /** i18n key for the legend row. */
  labelKey: string;
}

export const GAIN_BANDS: readonly GainBand[] = [
  { min: 10, color: '#0b6623', labelKey: 'map.legend.gain.strong' },
  { min: 3, color: '#2e8b57', labelKey: 'map.legend.gain.mid' },
  { min: 0, color: '#7bc47f', labelKey: 'map.legend.gain.light' },
  { min: -3, color: '#e08a8a', labelKey: 'map.legend.loss.light' },
  { min: -10, color: '#dc3545', labelKey: 'map.legend.loss.mid' },
  { min: Number.NEGATIVE_INFINITY, color: '#8b0000', labelKey: 'map.legend.loss.strong' },
] as const;

export const NO_DATA_COLOR = '#e0e0e0';

/** Colour for a gain in %, or the neutral grey when the trial reported nothing. */
export function colorForGain(gainPct: number | null | undefined): string {
  if (gainPct === null || gainPct === undefined) {
    return NO_DATA_COLOR;
  }
  return GAIN_BANDS.find((band) => gainPct >= band.min)?.color ?? NO_DATA_COLOR;
}

/** Marker diameter in px: grows with the absolute gain, clamped to [12, 36]. */
export function sizeForGain(gainPct: number | null | undefined): number {
  if (gainPct === null || gainPct === undefined) {
    return 12;
  }
  return Math.min(12 + Math.abs(gainPct) * 1.2, 36);
}

/** "+4.5%" / "-2.1%" / "-" */
export function formatGain(gainPct: number | null | undefined, digits = 1): string {
  if (gainPct === null || gainPct === undefined) {
    return '-';
  }
  return `${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(digits)}%`;
}

/** Country colours used to tint the dashboard scatter dots. */
export const COUNTRY_COLORS: Readonly<Record<string, string>> = {
  Austria: '#e67e22',
  Denmark: '#3498db',
  France: '#9b59b6',
  Germany: '#c9a227',
  Lithuania: '#e74c3c',
  Poland: '#c0392b',
  Sweden: '#1abc9c',
  'United Kingdom': '#34495e',
};

export function colorForCountry(country: string): string {
  return COUNTRY_COLORS[country] ?? '#888888';
}
