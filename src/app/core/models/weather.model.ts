import { CountryCode } from './trial.model';

/**
 * One row of the weather dashboard: the MeteoBlue-derived aggregates for a
 * trial location, joined with that trial's performance.
 *
 * Source of truth in Phase 1 is `src/assets/data/trial-weather.json`.
 */
export interface TrialWeather {
  trialId: string;
  country: string;
  countryCode: CountryCode;
  year: number;

  yieldGainPct: number | null;
  biomassGainPct: number | null;

  autumnPrecipitationMm: number | null;
  autumnMeanTempC: number | null;
  autumnDryDays: number | null;
  autumnHeavyRainDays: number | null;
  earlyAutumnPrecipitationMm: number | null;
  earlyAutumnMeanTempC: number | null;
  winterFrostDays: number | null;
  winterMinTempC: number | null;
  springPrecipitationMm: number | null;
  springMeanTempC: number | null;
  maxAutumnDryStretchDays: number | null;
}

/** Numeric weather columns that can be plotted on the X axis. */
export type WeatherVariableKey = Extract<
  keyof TrialWeather,
  | 'autumnPrecipitationMm'
  | 'autumnMeanTempC'
  | 'autumnDryDays'
  | 'autumnHeavyRainDays'
  | 'earlyAutumnPrecipitationMm'
  | 'earlyAutumnMeanTempC'
  | 'winterMinTempC'
  | 'winterFrostDays'
  | 'springPrecipitationMm'
  | 'springMeanTempC'
  | 'maxAutumnDryStretchDays'
>;

/** Performance metrics that can be plotted on the Y axis. */
export type PerformanceMetricKey = 'yieldGainPct' | 'biomassGainPct';

export interface WeatherVariable {
  key: WeatherVariableKey;
  /** i18n key for the chart title. */
  labelKey: string;
  unit: string;
  /** i18n key for the short methodological note under the title. */
  noteKey: string;
}

/**
 * The eleven weather variables shown as scatter plots, in display order.
 * Labels live in the i18n files so every country gets them translated.
 */
export const WEATHER_VARIABLES: readonly WeatherVariable[] = [
  {
    key: 'autumnPrecipitationMm',
    labelKey: 'weather.vars.autumnPrecipitation.label',
    unit: 'mm',
    noteKey: 'weather.vars.autumnPrecipitation.note',
  },
  {
    key: 'autumnMeanTempC',
    labelKey: 'weather.vars.autumnMeanTemp.label',
    unit: '°C',
    noteKey: 'weather.vars.autumnMeanTemp.note',
  },
  {
    key: 'autumnDryDays',
    labelKey: 'weather.vars.autumnDryDays.label',
    unit: 'days',
    noteKey: 'weather.vars.autumnDryDays.note',
  },
  {
    key: 'autumnHeavyRainDays',
    labelKey: 'weather.vars.autumnHeavyRainDays.label',
    unit: 'days',
    noteKey: 'weather.vars.autumnHeavyRainDays.note',
  },
  {
    key: 'earlyAutumnPrecipitationMm',
    labelKey: 'weather.vars.earlyAutumnPrecipitation.label',
    unit: 'mm',
    noteKey: 'weather.vars.earlyAutumnPrecipitation.note',
  },
  {
    key: 'earlyAutumnMeanTempC',
    labelKey: 'weather.vars.earlyAutumnMeanTemp.label',
    unit: '°C',
    noteKey: 'weather.vars.earlyAutumnMeanTemp.note',
  },
  {
    key: 'winterMinTempC',
    labelKey: 'weather.vars.winterMinTemp.label',
    unit: '°C',
    noteKey: 'weather.vars.winterMinTemp.note',
  },
  {
    key: 'winterFrostDays',
    labelKey: 'weather.vars.winterFrostDays.label',
    unit: 'days',
    noteKey: 'weather.vars.winterFrostDays.note',
  },
  {
    key: 'springPrecipitationMm',
    labelKey: 'weather.vars.springPrecipitation.label',
    unit: 'mm',
    noteKey: 'weather.vars.springPrecipitation.note',
  },
  {
    key: 'springMeanTempC',
    labelKey: 'weather.vars.springMeanTemp.label',
    unit: '°C',
    noteKey: 'weather.vars.springMeanTemp.note',
  },
  {
    key: 'maxAutumnDryStretchDays',
    labelKey: 'weather.vars.maxDryStretch.label',
    unit: 'days',
    noteKey: 'weather.vars.maxDryStretch.note',
  },
] as const;

/** Result of a Pearson correlation over the currently filtered rows. */
export interface Correlation {
  /** Pearson r, or null when fewer than 3 valid pairs. */
  r: number | null;
  /** Number of valid (x, y) pairs. */
  n: number;
}

/** One point rendered in a scatter plot, already projected to SVG space. */
export interface ScatterPoint {
  trialId: string;
  country: string;
  year: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  color: string;
}
