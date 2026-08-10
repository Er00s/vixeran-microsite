import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import type * as L from 'leaflet';

import { Trial, TrialMetric } from '../../../core/models/trial.model';
import {
  GAIN_BANDS,
  NO_DATA_COLOR,
  colorForGain,
  formatGain,
  sizeForGain,
} from '../../../core/services/gain-scale';
import { LanguageService } from '../../../core/services/language.service';
import { TrialsService } from '../../../core/services/trials.service';

/**
 * Interactive European trial map - the migration of `Vixeran_OSR_STR_map.html`
 * into an Angular component.
 *
 * Leaflet is loaded lazily (dynamic import inside afterNextRender) so it never
 * enters the initial bundle and never runs during a prerender/SSR pass.
 * Markers are rebuilt by an effect() whenever the filters or the active
 * language change.
 */
@Component({
  selector: 'app-trial-map',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-0 overflow-hidden rounded-md border border-sand-200 lg:grid-cols-[1fr_320px]">
      <!-- Map canvas -->
      <div class="relative min-h-[520px] bg-sand-100">
        <div #mapHost class="absolute inset-0" role="application" [attr.aria-label]="'map.ariaLabel' | translate"></div>

        @if (!ready()) {
          <p class="absolute inset-0 grid place-items-center text-sm text-soil-700">
            {{ 'map.loading' | translate }}
          </p>
        }
      </div>

      <!-- Sidebar: filters, live stats, legend -->
      <aside class="flex flex-col gap-6 border-t border-sand-200 bg-white p-5 lg:border-l lg:border-t-0">
        <div class="flex flex-col gap-3">
          <h3 class="text-sm tracking-wider text-brand-900">{{ 'map.filters.title' | translate }}</h3>

          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-soil-700">
              {{ 'map.filters.country' | translate }}
            </span>
            <select
              class="rounded-sm border border-sand-300 px-2 py-1.5 text-sm"
              [value]="trials.filters().country"
              (change)="trials.setCountry(value($event))"
            >
              <option value="all">{{ 'map.filters.allCountries' | translate }}</option>
              @for (country of trials.countries(); track country) {
                <option [value]="country">{{ country }}</option>
              }
            </select>
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-soil-700">
              {{ 'map.filters.season' | translate }}
            </span>
            <select
              class="rounded-sm border border-sand-300 px-2 py-1.5 text-sm"
              [value]="trials.filters().season"
              (change)="trials.setSeason(value($event))"
            >
              <option value="all">{{ 'map.filters.allSeasons' | translate }}</option>
              @for (season of trials.seasons(); track season) {
                <option [value]="season">{{ season }}</option>
              }
            </select>
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-soil-700">
              {{ 'map.filters.metric' | translate }}
            </span>
            <select
              class="rounded-sm border border-sand-300 px-2 py-1.5 text-sm"
              [value]="trials.filters().metric"
              (change)="trials.setMetric(metricValue($event))"
            >
              <option value="all">{{ 'map.filters.metricAll' | translate }}</option>
              <option value="yield">{{ 'map.filters.metricYield' | translate }}</option>
              <option value="biomass">{{ 'map.filters.metricBiomass' | translate }}</option>
            </select>
          </label>

          <button type="button" class="self-start text-xs underline text-brand-700" (click)="trials.resetFilters()">
            {{ 'map.filters.reset' | translate }}
          </button>
        </div>

        <!-- Live stats over the filtered set -->
        <dl class="rounded-md bg-brand-50 p-4">
          <dt class="text-[11px] uppercase tracking-wider text-soil-700">
            {{ 'map.stats.shown' | translate }}
          </dt>
          <dd class="font-display text-2xl font-bold text-brand-700">
            {{ trials.filteredSummary().count }}
          </dd>

          <dt class="mt-3 text-[11px] uppercase tracking-wider text-soil-700">
            {{ 'map.stats.avgYield' | translate }}
          </dt>
          <dd class="font-display text-2xl font-bold text-brand-700">
            {{ gain(trials.filteredSummary().avgYieldGainPct) }}
          </dd>

          <dt class="mt-3 text-[11px] uppercase tracking-wider text-soil-700">
            {{ 'map.stats.avgBiomass' | translate }}
          </dt>
          <dd class="font-display text-2xl font-bold text-brand-700">
            {{ gain(trials.filteredSummary().avgBiomassGainPct) }}
          </dd>
        </dl>

        <!-- Legend -->
        <div class="flex flex-col gap-2">
          <h3 class="text-sm tracking-wider text-brand-900">{{ 'map.legend.title' | translate }}</h3>

          <p class="text-[11px] text-soil-700">{{ 'map.legend.shape' | translate }}</p>
          <ul class="flex flex-col gap-1.5 text-xs">
            <li class="flex items-center gap-2">
              <span class="h-4 w-4 rounded-full border-2 border-white ring-1 ring-black/25" style="background:#2e8b57"></span>
              {{ 'map.legend.shapeYield' | translate }}
            </li>
            <li class="flex items-center gap-2">
              <span class="h-3.5 w-3.5 rotate-45 rounded-[3px] border-2 border-white ring-1 ring-black/25" style="background:#2e8b57"></span>
              {{ 'map.legend.shapeBiomass' | translate }}
            </li>
            <li class="flex items-center gap-2">
              <span class="h-4 w-4 rounded-full border-2 border-dashed border-neutral-400" [style.background]="noDataColor"></span>
              {{ 'map.legend.shapeNone' | translate }}
            </li>
          </ul>

          <p class="mt-2 text-[11px] text-soil-700">{{ 'map.legend.color' | translate }}</p>
          <ul class="flex flex-col gap-1.5 text-xs">
            @for (band of bands; track band.labelKey) {
              <li class="flex items-center gap-2">
                <span class="h-4 w-4 rounded-full" [style.background]="band.color"></span>
                {{ band.labelKey | translate }}
              </li>
            }
          </ul>
          <p class="text-[11px] text-soil-700/80">{{ 'map.legend.size' | translate }}</p>
        </div>
      </aside>
    </div>
  `,
})
export class TrialMap implements OnDestroy {
  protected readonly trials = inject(TrialsService);
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  private readonly mapHost = viewChild.required<ElementRef<HTMLElement>>('mapHost');

  protected readonly ready = signal(false);
  protected readonly bands = GAIN_BANDS;
  protected readonly noDataColor = NO_DATA_COLOR;

  /** Leaflet namespace, resolved lazily in the browser. */
  private leaflet?: typeof L;
  private map?: L.Map;
  private cluster?: L.MarkerClusterGroup;

  constructor() {
    afterNextRender(() => void this.initMap());

    // Re-render markers whenever the filtered set or the language changes.
    // Reading `language.current()` inside the effect is what makes popups
    // re-translate on a language switch.
    effect(() => {
      const rows = this.trials.filteredTrials();
      this.language.current();
      if (this.ready()) {
        this.renderMarkers(rows);
      }
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  protected value(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected metricValue(event: Event): TrialMetric | 'all' {
    return (event.target as HTMLSelectElement).value as TrialMetric | 'all';
  }

  protected gain(value: number | null): string {
    return formatGain(value);
  }

  private async initMap(): Promise<void> {
    // Leaflet ships as CommonJS, so the dynamic import resolves to a namespace
    // whose `default` holds the real `L`. Normalise both shapes.
    const leafletModule = (await import('leaflet')) as unknown as typeof L & { default?: typeof L };
    const leaflet = leafletModule.default ?? leafletModule;
    // markercluster has no exports of its own - it patches L on import.
    await import('leaflet.markercluster');
    this.leaflet = leaflet;

    const map = leaflet
      .map(this.mapHost().nativeElement, {
        // Let the page keep scrolling over the map; ctrl+wheel still zooms.
        scrollWheelZoom: false,
        attributionControl: true,
      })
      .setView([53, 12], 4);

    leaflet
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      })
      .addTo(map);

    this.cluster = leaflet.markerClusterGroup({
      maxClusterRadius: 30,
      showCoverageOnHover: false,
    });
    map.addLayer(this.cluster);

    this.map = map;
    this.ready.set(true);
    this.renderMarkers(this.trials.filteredTrials());
  }

  private renderMarkers(rows: readonly Trial[]): void {
    const leaflet = this.leaflet;
    const cluster = this.cluster;
    if (!leaflet || !cluster) {
      return;
    }

    cluster.clearLayers();
    for (const trial of rows) {
      const marker = leaflet.marker([trial.lat, trial.lon], {
        icon: this.iconFor(leaflet, trial),
        title: `${trial.city ?? trial.trialId} (${trial.country})`,
      });
      marker.bindPopup(this.popupHtml(trial), { maxWidth: 360 });
      cluster.addLayer(marker);
    }
  }

  /** Circle for yield trials, diamond for biomass-only trials. */
  private iconFor(leaflet: typeof L, trial: Trial): L.DivIcon {
    const size = sizeForGain(trial.gainPct);
    const color = colorForGain(trial.gainPct);
    const hasData = trial.gainPct !== null;

    const shape =
      trial.metric === 'biomass'
        ? `<polygon points="${size / 2},1 ${size - 1},${size / 2} ${size / 2},${size - 1} 1,${size / 2}"
             fill="${color}" stroke="#fff" stroke-width="2" />`
        : `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="${color}"
             stroke="${hasData ? '#fff' : '#777'}" stroke-width="2"
             ${hasData ? '' : 'stroke-dasharray="3,3"'} />`;

    return leaflet.divIcon({
      html: `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${shape}</svg>`,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  private popupHtml(trial: Trial): string {
    const t = (key: string): string => this.translate.instant(key) as string;
    const badge = (value: number | null): string =>
      value === null
        ? `<span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:700;color:#fff;background:#999">${t('map.popup.noData')}</span>`
        : `<span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:700;color:#fff;background:${colorForGain(value)}">${formatGain(value)}</span>`;

    const row = (label: string, value: string): string =>
      `<div style="font-size:12px;margin:2px 0"><b style="color:#333">${label}:</b> ${value}</div>`;

    return `
      <div style="font-weight:700;color:#0f6d3e;font-size:13px">${trial.city ?? trial.trialId} (${trial.country})</div>
      ${row(t('map.popup.trialId'), trial.trialId)}
      ${row(t('map.popup.season'), trial.season)}
      ${row(t('map.popup.variety'), trial.variety ?? '-')}
      ${row(t('map.popup.region'), trial.region ?? '-')}
      ${row(t('map.popup.soil'), trial.soil ?? '-')}
      ${row(t('map.popup.product'), trial.product)}
      <div style="margin-top:8px">${row(t('map.popup.yieldGain'), badge(trial.yieldGainPct))}</div>
      ${
        trial.yieldControlDtHa !== null
          ? `<div style="font-size:12px;color:#666">${t('map.popup.control')}: ${trial.yieldControlDtHa.toFixed(2)} dt/ha &rarr; VIXERAN: ${trial.yieldVixeranDtHa?.toFixed(2) ?? '-'} dt/ha</div>`
          : ''
      }
      <div style="margin-top:6px">${row(t('map.popup.biomassGain'), badge(trial.biomassGainPct))}</div>
      ${trial.biomassDescription ? `<div style="font-size:11px;color:#666">${trial.biomassDescription}</div>` : ''}
      <div style="margin-top:6px;font-size:10.5px;color:#888">${t('map.popup.source')}: ${trial.source}</div>
    `;
  }
}
