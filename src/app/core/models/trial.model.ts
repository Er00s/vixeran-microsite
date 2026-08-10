/**
 * Domain model for a single ARM Single Trial Report (STR).
 *
 * Source of truth in Phase 1 is `src/assets/data/trials.json`.
 * In Phase 2 the exact same shape will be served by the REST API, so no
 * component needs to change when the backend arrives - only TrialsService.
 */

/** Which performance metric the trial actually reported. */
export type TrialMetric = 'yield' | 'biomass' | 'none';

export type CountryCode = 'AT' | 'DE' | 'DK' | 'FR' | 'GB' | 'LT' | 'PL' | 'SE';

export interface Trial {
  /** ARM trial identifier, e.g. "ATDATP7092023". Unique. */
  trialId: string;
  country: string;
  countryCode: CountryCode;
  /** Harvest year. */
  year: number;
  /** Growing season, e.g. "2023-24". */
  season: string;
  city: string | null;
  region: string | null;
  lat: number;
  lon: number;
  variety: string | null;
  soil: string | null;
  /** Commercial or experimental product code applied in the trial. */
  product: string;
  treatment: string | null;
  /** ARM application timing code (A = at sowing, B = 2-4 leaves, ...). */
  timingCode: string | null;

  /** Primary metric available for this trial - drives the marker shape. */
  metric: TrialMetric;
  /** Gain (%) of the primary metric - drives marker colour and size. */
  gainPct: number | null;

  yieldControlDtHa: number | null;
  yieldVixeranDtHa: number | null;
  yieldGainDtHa: number | null;
  yieldGainPct: number | null;

  biomassControl: number | null;
  biomassVixeran: number | null;
  biomassGainPct: number | null;
  /** Free-text description of how biomass was measured. */
  biomassDescription: string | null;

  /** Original STR file name, kept for traceability. */
  source: string;
}

/** Pre-computed headline numbers used by the hero and the KPI strip. */
export interface TrialKpis {
  trialCount: number;
  countryCount: number;
  seasons: string[];
  seasonCount: number;
  avgYieldGainPct: number;
  avgBiomassGainPct: number;
  trialsWithYieldData: number;
  trialsWithBiomassData: number;
  positiveYieldTrials: number;
  bestYieldGainPct: number;
}

/** State of the three filters above the trial map. */
export interface TrialFilters {
  country: string | 'all';
  season: string | 'all';
  metric: TrialMetric | 'all';
}

export const DEFAULT_TRIAL_FILTERS: TrialFilters = {
  country: 'all',
  season: 'all',
  metric: 'all',
};
