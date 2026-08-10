import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  PerformanceMetricKey,
  WEATHER_VARIABLES,
  WeatherVariable,
} from '../../../core/models/weather.model';
import { COUNTRY_COLORS } from '../../../core/services/gain-scale';
import { pearson } from '../../../core/services/statistics';
import { TrialsService } from '../../../core/services/trials.service';
import { ScatterChart } from './scatter-chart';

/**
 * Weather vs performance dashboard - the migration of
 * `Vixeran_OSR_weather_dashboard.html` into Angular.
 *
 * Eleven scatter plots share one filter state (metric + country toggles) and
 * recompute through signals, so switching the Y axis re-renders every chart in
 * a single change-detection pass.
 */
@Component({
  selector: 'app-weather-dashboard',
  imports: [TranslatePipe, ScatterChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6">
      <!-- Controls -->
      <div class="flex flex-wrap items-end gap-4">
        <label class="flex flex-col gap-1">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-soil-700">
            {{ 'weather.controls.metric' | translate }}
          </span>
          <select
            class="rounded-sm border border-sand-300 bg-white px-2 py-1.5 text-sm"
            [value]="metric()"
            (change)="setMetric($event)"
          >
            <option value="yieldGainPct">{{ 'weather.metric.yield' | translate }}</option>
            <option value="biomassGainPct">{{ 'weather.metric.biomass' | translate }}</option>
          </select>
        </label>

        <fieldset class="flex flex-wrap items-center gap-2">
          <legend class="sr-only">{{ 'weather.controls.countries' | translate }}</legend>
          @for (country of countryNames; track country) {
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-sm bg-sand-100 px-2 py-1 text-[11px] transition-opacity"
              [class.opacity-30]="!activeCountries().has(country)"
              [attr.aria-pressed]="activeCountries().has(country)"
              (click)="toggleCountry(country)"
            >
              <span class="h-2.5 w-2.5 rounded-full" [style.background]="countryColors[country]"></span>
              {{ country }}
            </button>
          }
        </fieldset>
      </div>

      <!-- Summary strip -->
      <dl class="flex flex-wrap gap-3">
        @for (stat of summary(); track stat.labelKey) {
          <div class="vx-card min-w-28">
            <dt class="text-[11px] uppercase tracking-wider text-soil-700">
              {{ stat.labelKey | translate }}
            </dt>
            <dd class="font-display text-2xl font-bold text-brand-700">{{ stat.value }}</dd>
          </div>
        }
      </dl>

      <!-- Charts -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (variable of variables; track variable.key) {
          <app-scatter-chart [rows]="rows()" [variable]="variable" [metric]="metric()" />
        }
      </div>

      <!-- Automatically ranked signals -->
      <div class="rounded-md border-l-4 border-brand-700 bg-white p-5">
        <h4 class="font-display text-sm uppercase tracking-wide text-brand-900">
          {{ 'weather.findings.title' | translate }}
        </h4>
        <ul class="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-soil-700">
          @for (finding of findings(); track finding.variable.key) {
            <li>
              <b>{{ finding.variable.labelKey | translate }}</b>
              : r = {{ finding.r > 0 ? '+' : '' }}{{ finding.r.toFixed(3) }} (n = {{ finding.n }}) —
              {{
                (finding.r > 0 ? 'weather.findings.higher' : 'weather.findings.lower') | translate
              }}
            </li>
          } @empty {
            <li>{{ 'weather.findings.none' | translate }}</li>
          }
        </ul>
        <p class="mt-3 text-[11px] leading-relaxed text-soil-700/80">
          {{ 'weather.findings.disclaimer' | translate }}
        </p>
      </div>
    </div>
  `,
})
export class WeatherDashboard {
  private readonly trials = inject(TrialsService);

  protected readonly variables: readonly WeatherVariable[] = WEATHER_VARIABLES;
  protected readonly countryColors = COUNTRY_COLORS;
  protected readonly countryNames = Object.keys(COUNTRY_COLORS);

  protected readonly metric = signal<PerformanceMetricKey>('yieldGainPct');
  protected readonly activeCountries = signal<ReadonlySet<string>>(new Set(this.countryNames));

  /** Weather rows for the countries currently toggled on. */
  protected readonly rows = computed(() =>
    this.trials.weather().filter((row) => this.activeCountries().has(row.country)),
  );

  protected readonly summary = computed(() => {
    const rows = this.rows();
    const y = rows.map((r) => r.yieldGainPct).filter((v): v is number => v !== null);
    const b = rows.map((r) => r.biomassGainPct).filter((v): v is number => v !== null);
    const avg = (list: number[]): string =>
      list.length ? `${(list.reduce((s, v) => s + v, 0) / list.length).toFixed(1)}%` : '—';

    return [
      { labelKey: 'weather.summary.trials', value: `${rows.length}` },
      { labelKey: 'weather.summary.withYield', value: `${y.length}` },
      { labelKey: 'weather.summary.avgYield', value: avg(y) },
      { labelKey: 'weather.summary.withBiomass', value: `${b.length}` },
      { labelKey: 'weather.summary.avgBiomass', value: avg(b) },
    ];
  });

  /** Top four correlations by |r|, ignoring anything with fewer than 5 pairs. */
  protected readonly findings = computed(() =>
    this.variables
      .map((variable) => ({ variable, ...pearson(this.rows(), variable.key, this.metric()) }))
      .filter((f): f is { variable: WeatherVariable; r: number; n: number } => f.r !== null && f.n >= 5)
      .sort((a, b) => Math.abs(b.r) - Math.abs(a.r))
      .slice(0, 4),
  );

  protected setMetric(event: Event): void {
    this.metric.set((event.target as HTMLSelectElement).value as PerformanceMetricKey);
  }

  protected toggleCountry(country: string): void {
    this.activeCountries.update((current) => {
      const next = new Set(current);
      if (next.has(country)) {
        next.delete(country);
      } else {
        next.add(country);
      }
      // Never let the user blank the whole dashboard.
      return next.size ? next : current;
    });
  }
}
