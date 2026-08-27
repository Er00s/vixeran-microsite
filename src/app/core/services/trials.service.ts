import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay } from 'rxjs';

import {
  DEFAULT_TRIAL_FILTERS,
  Trial,
  TrialFilters,
  TrialKpis,
  TrialMetric,
} from '../models/trial.model';

/**
 * Single access point for trial data.
 *
 * PHASE 1 (current): reads static JSON from `assets/data/`.
 * PHASE 2 (backend): swap the three URLs below for REST endpoints. Nothing
 * else in the application needs to change - the signals stay identical.
 */
@Injectable({ providedIn: 'root' })
export class TrialsService {
  private readonly http = inject(HttpClient);

  private static readonly TRIALS_URL = 'assets/data/trials.json';
  private static readonly KPIS_URL = 'assets/data/trial-kpis.json';

  /** All 51 trials. Empty array until the JSON resolves. */
  readonly trials = toSignal(
    this.http.get<Trial[]>(TrialsService.TRIALS_URL).pipe(shareReplay(1)),
    { initialValue: [] as Trial[] },
  );

  /** Pre-computed headline figures for the KPI strip. */
  readonly kpis = toSignal(this.http.get<TrialKpis>(TrialsService.KPIS_URL).pipe(shareReplay(1)), {
    initialValue: null,
  });

  /** Filter state shared by the map. */
  private readonly filtersState = signal<TrialFilters>({ ...DEFAULT_TRIAL_FILTERS });
  readonly filters = this.filtersState.asReadonly();

  /** Distinct countries present in the dataset, alphabetically. */
  readonly countries = computed(() =>
    [...new Set(this.trials().map((t) => t.country))].sort((a, b) => a.localeCompare(b)),
  );

  /** Distinct seasons present in the dataset, chronologically. */
  readonly seasons = computed(() =>
    [...new Set(this.trials().map((t) => t.season))].sort((a, b) => a.localeCompare(b)),
  );

  /** Trials matching the current filters - what the map renders. */
  readonly filteredTrials = computed(() => {
    const { country, season, metric } = this.filtersState();
    return this.trials().filter(
      (t) =>
        (country === 'all' || t.country === country) &&
        (season === 'all' || t.season === season) &&
        (metric === 'all' || t.metric === metric),
    );
  });

  /** Live averages over the filtered set - what the map sidebar shows. */
  readonly filteredSummary = computed(() => {
    const rows = this.filteredTrials();
    const y = rows.map((t) => t.yieldGainPct).filter((v): v is number => v !== null);
    const b = rows.map((t) => t.biomassGainPct).filter((v): v is number => v !== null);
    const mean = (values: number[]): number | null =>
      values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
    const headlineMetric = this.filtersState().metric === 'yield' ? 'yield' : 'biomass';
    const headlineSeries = headlineMetric === 'yield' ? y : b;
    return {
      count: rows.length,
      avgYieldGainPct: mean(y),
      avgBiomassGainPct: mean(b),
      headlineMetric,
      headlineAvg: mean(headlineSeries),
      headlinePositive: headlineSeries.filter((value) => value > 0).length,
      headlineTotal: headlineSeries.length,
    };
  });

  setCountry(country: string | 'all'): void {
    this.filtersState.update((f) => ({ ...f, country }));
  }

  setSeason(season: string | 'all'): void {
    this.filtersState.update((f) => ({ ...f, season }));
  }

  setMetric(metric: TrialMetric | 'all'): void {
    this.filtersState.update((f) => ({ ...f, metric }));
  }

  resetFilters(): void {
    this.filtersState.set({ ...DEFAULT_TRIAL_FILTERS });
  }
}
