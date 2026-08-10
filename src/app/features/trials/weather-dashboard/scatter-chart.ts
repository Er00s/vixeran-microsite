import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  PerformanceMetricKey,
  TrialWeather,
  WeatherVariable,
} from '../../../core/models/weather.model';
import { colorForCountry } from '../../../core/services/gain-scale';
import { correlationStrength, linearFit, pearson, ticks } from '../../../core/services/statistics';

const W = 340;
const H = 260;
const PAD = { left: 44, right: 12, top: 12, bottom: 30 };

interface Axis {
  min: number;
  max: number;
}

/**
 * One weather variable plotted against one performance metric, with an OLS
 * trend line and the Pearson r in the caption.
 *
 * Rendered as inline SVG rather than through a charting library: eleven of
 * these have to fit in one screen and stay in the campaign's visual language,
 * and the maths is 40 lines. No runtime chart dependency ships to the browser.
 */
@Component({
  selector: 'app-scatter-chart',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="vx-card">
      <figcaption>
        <h4 class="font-display text-sm uppercase tracking-wide text-brand-900">
          {{ variable().labelKey | translate }}
          <span class="font-sans text-[11px] normal-case text-soil-700">({{ variable().unit }})</span>
        </h4>
        <p class="mt-0.5 text-[11px] text-soil-700">{{ variable().noteKey | translate }}</p>
        <p class="mt-1.5 text-xs font-bold" [class]="correlationClass()">
          r = {{ rLabel() }} &nbsp;|&nbsp; n = {{ correlation().n }}
        </p>
      </figcaption>

      @if (points().length) {
        <svg
          class="mt-2 block h-[260px] w-full"
          [attr.viewBox]="'0 0 ' + W + ' ' + H"
          role="img"
          [attr.aria-label]="(variable().labelKey | translate) + ' vs ' + (metricLabelKey() | translate)"
        >
          <rect
            [attr.x]="pad.left"
            [attr.y]="pad.top"
            [attr.width]="W - pad.left - pad.right"
            [attr.height]="H - pad.top - pad.bottom"
            fill="#fafafa"
            stroke="#e8e2d1"
          />

          @if (zeroY() !== null) {
            <line
              [attr.x1]="pad.left"
              [attr.y1]="zeroY()"
              [attr.x2]="W - pad.right"
              [attr.y2]="zeroY()"
              stroke="#bbb"
              stroke-dasharray="2,2"
            />
          }

          @if (trendLine(); as line) {
            <line
              [attr.x1]="line.x1"
              [attr.y1]="line.y1"
              [attr.x2]="line.x2"
              [attr.y2]="line.y2"
              stroke="#0f6d3e"
              stroke-width="1.5"
              stroke-dasharray="4,3"
              opacity="0.6"
            />
          }

          @for (tick of xTicks(); track tick.value) {
            <g>
              <line [attr.x1]="tick.pos" [attr.y1]="H - pad.bottom" [attr.x2]="tick.pos" [attr.y2]="H - pad.bottom + 4" stroke="#666" />
              <text [attr.x]="tick.pos" [attr.y]="H - pad.bottom + 16" text-anchor="middle" font-size="10" fill="#666">
                {{ tick.value }}
              </text>
            </g>
          }

          @for (tick of yTicks(); track tick.value) {
            <g>
              <line [attr.x1]="pad.left - 4" [attr.y1]="tick.pos" [attr.x2]="pad.left" [attr.y2]="tick.pos" stroke="#666" />
              <text [attr.x]="pad.left - 6" [attr.y]="tick.pos + 3" text-anchor="end" font-size="10" fill="#666">
                {{ tick.value }}
              </text>
            </g>
          }

          @for (point of points(); track point.trialId) {
            <circle
              [attr.cx]="point.cx"
              [attr.cy]="point.cy"
              r="5"
              [attr.fill]="point.color"
              stroke="#fff"
              stroke-width="1"
            >
              <title>
                {{ point.trialId }} — {{ point.country }} {{ point.year }} · {{ point.x }}
                {{ variable().unit }} · {{ point.y }}%
              </title>
            </circle>
          }
        </svg>
      } @else {
        <p class="grid h-[260px] place-items-center text-xs text-soil-700">
          {{ 'weather.noData' | translate }}
        </p>
      }
    </figure>
  `,
})
export class ScatterChart {
  readonly rows = input.required<readonly TrialWeather[]>();
  readonly variable = input.required<WeatherVariable>();
  readonly metric = input.required<PerformanceMetricKey>();

  protected readonly W = W;
  protected readonly H = H;
  protected readonly pad = PAD;

  protected readonly metricLabelKey = computed(() =>
    this.metric() === 'yieldGainPct' ? 'weather.metric.yield' : 'weather.metric.biomass',
  );

  /** Rows where both the weather variable and the metric are present. */
  private readonly validRows = computed(() =>
    this.rows().filter((row) => {
      const x = row[this.variable().key];
      const y = row[this.metric()];
      return typeof x === 'number' && Number.isFinite(x) && typeof y === 'number' && Number.isFinite(y);
    }),
  );

  protected readonly correlation = computed(() =>
    pearson(this.validRows(), this.variable().key, this.metric()),
  );

  protected readonly rLabel = computed(() => {
    const r = this.correlation().r;
    return r === null ? '-' : r.toFixed(3);
  });

  protected readonly correlationClass = computed(() => {
    switch (correlationStrength(this.correlation().r)) {
      case 'positive':
        return 'text-brand-700';
      case 'negative':
        return 'text-red-700';
      default:
        return 'text-soil-700';
    }
  });

  /** X axis domain with 8% padding on each side. */
  private readonly xAxis = computed<Axis>(() => this.axis(this.validRows().map((r) => r[this.variable().key] as number), false));

  /** Y axis domain, always including zero so the baseline is meaningful. */
  private readonly yAxis = computed<Axis>(() => this.axis(this.validRows().map((r) => r[this.metric()] as number), true));

  protected readonly points = computed(() =>
    this.validRows().map((row) => {
      const x = row[this.variable().key] as number;
      const y = row[this.metric()] as number;
      return {
        trialId: row.trialId,
        country: row.country,
        year: row.year,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        cx: this.scaleX(x),
        cy: this.scaleY(y),
        color: colorForCountry(row.country),
      };
    }),
  );

  protected readonly zeroY = computed(() => {
    const { min, max } = this.yAxis();
    return min < 0 && max > 0 ? this.scaleY(0) : null;
  });

  protected readonly trendLine = computed(() => {
    const fit = linearFit(
      this.validRows().map(
        (row) => [row[this.variable().key] as number, row[this.metric()] as number] as const,
      ),
    );
    if (!fit) {
      return null;
    }
    const { min, max } = this.xAxis();
    return {
      x1: this.scaleX(min),
      y1: this.scaleY(fit.intercept + fit.slope * min),
      x2: this.scaleX(max),
      y2: this.scaleY(fit.intercept + fit.slope * max),
    };
  });

  protected readonly xTicks = computed(() => {
    const { min, max } = this.xAxis();
    return ticks(min, max).map((value) => ({
      value: Math.round(value * 10) / 10,
      pos: this.scaleX(value),
    }));
  });

  protected readonly yTicks = computed(() => {
    const { min, max } = this.yAxis();
    return ticks(min, max).map((value) => ({
      value: Math.round(value * 10) / 10,
      pos: this.scaleY(value),
    }));
  });

  private axis(values: readonly number[], includeZero: boolean): Axis {
    if (!values.length) {
      return { min: 0, max: 1 };
    }
    const raw = includeZero ? [0, ...values] : values;
    const lo = Math.min(...raw);
    const hi = Math.max(...raw);
    const pad = (hi - lo) * 0.08 || 1;
    return { min: lo - pad, max: hi + pad };
  }

  private scaleX(value: number): number {
    const { min, max } = this.xAxis();
    return PAD.left + ((value - min) / (max - min)) * (W - PAD.left - PAD.right);
  }

  private scaleY(value: number): number {
    const { min, max } = this.yAxis();
    return H - PAD.bottom - ((value - min) / (max - min)) * (H - PAD.top - PAD.bottom);
  }
}
