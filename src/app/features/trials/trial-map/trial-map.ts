import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
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
import {
  WORLD_GEOJSON_URL,
  MAP_WATER,
  escapeHtml,
  labelFor,
  labelVisible,
  landStyle,
  type EuropeProps,
} from './europe-map';

interface EuropeFeature {
  type: 'Feature';
  properties: EuropeProps;
  geometry: object;
}

interface EuropeCollection {
  type: 'FeatureCollection';
  features: EuropeFeature[];
}

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
  host: { class: 'vx-trial-map flex min-h-0 flex-1 flex-col' },
  template: `
    <div
      class="grid min-h-0 flex-1 items-stretch gap-5 lg:h-full lg:grid-cols-[minmax(0,1fr)_300px] lg:grid-rows-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_320px]"
    >    
      <div class="flex min-h-0 min-w-0 flex-col lg:h-full gap-8">
      <h2
            class="vx-trials-title text-3xl font-semibold leading-[1.1] text-white
                   md:text-5xl md:leading-[1.1]"
            [innerHTML]="titleHtml()"
          ></h2>
        <div
          class="relative min-h-[240px] w-full flex-1 overflow-hidden rounded-[28px] aspect-video lg:aspect-auto lg:min-h-0"
          [style.background]="water"
        >
          <div #mapHost class="absolute inset-0" role="application" [attr.aria-label]="'map.ariaLabel' | translate"></div>

          @if (!ready()) {
            <p class="absolute inset-0 grid place-items-center text-sm text-soil-700">
              {{ 'map.loading' | translate }}
            </p>
          }
        </div>
      </div>

      <aside
        class="flex h-full min-h-0 flex-col gap-5 rounded-[28px] border border-white/35 bg-white/10 p-5 text-white backdrop-blur-md"
      >
        <div class="flex flex-col gap-3">
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.18em]">
            {{ 'map.filters.title' | translate }}
          </h3>

          <label class="flex flex-col gap-1.5">
            <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
              {{ 'map.filters.country' | translate }}
            </span>
            <select
              class="vx-map-select"
              [value]="trials.filters().country"
              (change)="trials.setCountry(value($event))"
            >
              <option value="all">{{ 'map.filters.allCountries' | translate }}</option>
              @for (country of trials.countries(); track country) {
                <option [value]="country">{{ country }}</option>
              }
            </select>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
              {{ 'map.filters.season' | translate }}
            </span>
            <select
              class="vx-map-select"
              [value]="trials.filters().season"
              (change)="trials.setSeason(value($event))"
            >
              <option value="all">{{ 'map.filters.allSeasons' | translate }}</option>
              @for (season of trials.seasons(); track season) {
                <option [value]="season">{{ season }}</option>
              }
            </select>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
              {{ 'map.filters.metric' | translate }}
            </span>
            <select
              class="vx-map-select"
              [value]="trials.filters().metric"
              (change)="trials.setMetric(metricValue($event))"
            >
              <option value="all">{{ 'map.filters.metricAll' | translate }}</option>
              <option value="yield">{{ 'map.filters.metricYield' | translate }}</option>
              <option value="biomass">{{ 'map.filters.metricBiomass' | translate }}</option>
            </select>
          </label>

          <button type="button" class="self-start text-xs text-white/90 underline" (click)="trials.resetFilters()">
            {{ 'map.filters.reset' | translate }}
          </button>
        </div>

        <p class="text-[10px] leading-snug text-white/70">{{ 'map.stats.dynamicNote' | translate }}</p>

        <div class="grid grid-cols-3 gap-1.5">
          <div class="rounded-xl bg-white px-2 py-2.5 text-center">
            <p class="font-display text-lg font-bold leading-none text-brand-600">
              {{ gain(summary().headlineAvg) }}
            </p>
            <p class="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-wide text-ink-900">
              {{ 'map.stats.avgIncrease' | translate: { metric: (metricKey() | translate) } }}
            </p>
          </div>

          <div class="rounded-xl bg-white px-2 py-2.5 text-center">
            <p class="font-display text-[13px] font-bold leading-none text-brand-600">
              @if (summary().headlineTotal) {
                {{
                  'map.stats.ratioLine'
                    | translate: { positive: summary().headlinePositive, total: summary().headlineTotal }
                }}
              } @else {
                —
              }
            </p>
            <p class="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-wide text-ink-900">
              {{ 'map.stats.ratioCaption' | translate: { metric: (metricKey() | translate) } }}
            </p>
          </div>

          <div class="grid place-items-center rounded-xl bg-brand-500 px-2 py-2.5 text-center">
            <p class="text-[9px] font-semibold uppercase leading-tight tracking-wide text-white">
              {{ 'map.stats.conditions' | translate }}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.18em]">
            {{ 'map.legend.title' | translate }}
          </h3>

          <div class="rounded-2xl bg-white p-4 text-ink-900">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-ink-700">
              {{ 'map.legend.shape' | translate }}
            </p>
            <ul class="mt-2 flex flex-col gap-1.5 text-xs">
              <li class="flex items-center gap-2">
                <span class="h-4 w-4 shrink-0 rounded-full border-2 border-white ring-1 ring-black/25" style="background:#2e8b57"></span>
                {{ 'map.legend.shapeYield' | translate }}
              </li>
              <li class="flex items-center gap-2">
                <span
                  class="h-3.5 w-3.5 shrink-0 rotate-45 rounded-[3px] border-2 border-white ring-1 ring-black/25"
                  style="background:#2e8b57"
                ></span>
                {{ 'map.legend.shapeBiomass' | translate }}
              </li>
              <li class="flex items-center gap-2">
                <span
                  class="h-4 w-4 shrink-0 rounded-full border-2 border-dashed border-neutral-400"
                  [style.background]="noDataColor"
                ></span>
                {{ 'map.legend.shapeNone' | translate }}
              </li>
            </ul>

            <p class="mt-3 text-[11px] font-semibold uppercase tracking-wider text-ink-700">
              {{ 'map.legend.color' | translate }}
            </p>
            <ul class="mt-2 flex flex-col gap-1.5 text-xs">
              @for (band of bands; track band.labelKey) {
                <li class="flex items-center gap-2">
                  <span class="h-4 w-4 shrink-0 rounded-full" [style.background]="band.color"></span>
                  {{ band.labelKey | translate }}
                </li>
              }
            </ul>
            <p class="mt-2 text-[11px] text-ink-700/70">{{ 'map.legend.size' | translate }}</p>
          </div>
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
  protected readonly water = MAP_WATER;

  protected readonly summary = computed(() => this.trials.filteredSummary());
  protected readonly metricKey = computed(() =>
    this.summary().headlineMetric === 'yield' ? 'map.stats.metricYield' : 'map.stats.metricBiomass',
  );

  /** Leaflet namespace, resolved lazily in the browser. */
  private leaflet?: typeof L;
  private map?: L.Map;
  private cluster?: L.MarkerClusterGroup;
  private resizeObserver?: ResizeObserver;
  private readonly labelMarkers: { marker: L.Marker; rank: number }[] = [];

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
    this.resizeObserver?.disconnect();
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
        scrollWheelZoom: false,
        attributionControl: false,
        minZoom: 2,
        maxZoom: 8,
        worldCopyJump: true,
      })
      .setView([54, 15], 4);

    map.getContainer().style.background = MAP_WATER;
    map.createPane('countryLabels');
    const labelPane = map.getPane('countryLabels');
    if (labelPane) {
      labelPane.style.zIndex = '450';
      labelPane.style.pointerEvents = 'none';
    }

    this.cluster = leaflet.markerClusterGroup({
      maxClusterRadius: 30,
      showCoverageOnHover: false,
    });
    map.addLayer(this.cluster);
    map.on('zoomend', () => this.refreshLabels());

    this.map = map;
    this.resizeObserver = new ResizeObserver(() => map.invalidateSize());
    this.resizeObserver.observe(this.mapHost().nativeElement);
    await this.loadLand();
    map.invalidateSize();
    map.setView([54, 15], 4);

    this.ready.set(true);
    this.renderMarkers(this.trials.filteredTrials());
  }

  /**
   * Land as GeoJSON polygons, water as the map background — the approach from
   * https://stackoverflow.com/questions/28339414/leaflet-change-map-color
   */
  private async loadLand(): Promise<void> {
    const leaflet = this.leaflet;
    const map = this.map;
    if (!leaflet || !map) {
      return;
    }

    try {
      const response = await fetch(WORLD_GEOJSON_URL);
      const collection = (await response.json()) as EuropeCollection;
      const land = leaflet.geoJSON(collection, {
        style: (feature) => landStyle((feature as EuropeFeature | undefined)?.properties.iso ?? ''),
      });
      land.addTo(map);
      map.setMaxBounds(leaflet.latLngBounds([-55, -180], [85, 180]));

      for (const feature of collection.features) {
        const { iso, name, rank, lx, ly } = feature.properties;
        if (lx === null || ly === null) {
          continue;
        }
        const marker = leaflet.marker([ly, lx], {
          pane: 'countryLabels',
          interactive: false,
          keyboard: false,
          icon: leaflet.divIcon({
            className: `vx-map-label vx-map-label--r${rank}`,
            html: `<span class="vx-map-label__text">${escapeHtml(labelFor(iso, name))}</span>`,
            iconSize: [0, 0],
          }),
        });
        marker.addTo(map);
        this.labelMarkers.push({ marker, rank });
      }
      this.refreshLabels();
    } catch {
      map.setMaxBounds(leaflet.latLngBounds([-55, -180], [85, 180]));
    }
  }

  private refreshLabels(): void {
    const zoom = this.map?.getZoom() ?? 4;
    for (const { marker, rank } of this.labelMarkers) {
      const el = marker.getElement();
      if (el) {
        el.style.display = labelVisible(rank, zoom) ? '' : 'none';
      }
    }
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
      marker.bindPopup(this.popupHtml(trial), { maxWidth: 360, className: 'vx-map-popup' });
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

  protected readonly titleHtml = computed(() => {
    this.language.current();
    const text = String(this.translate.instant('trials.title'));
    return text.replace(/VIXERAN®/g, '<span class="text-brand-500">VIXERAN®</span>');
  });

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
      ${trial.yieldControlDtHa !== null
        ? `<div style="font-size:12px;color:#666">${t('map.popup.control')}: ${trial.yieldControlDtHa.toFixed(2)} dt/ha &rarr; VIXERAN: ${trial.yieldVixeranDtHa?.toFixed(2) ?? '-'} dt/ha</div>`
        : ''
      }
      <div style="margin-top:6px">${row(t('map.popup.biomassGain'), badge(trial.biomassGainPct))}</div>
      ${trial.biomassDescription ? `<div style="font-size:11px;color:#666">${trial.biomassDescription}</div>` : ''}
      <div style="margin-top:6px;font-size:10.5px;color:#888">${t('map.popup.source')}: ${trial.source}</div>
    `;
  }
}
