import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { SectionShell } from '../../shared/components/section-shell';
import { TrialMap } from './trial-map/trial-map';
import { WeatherDashboard } from './weather-dashboard/weather-dashboard';

type TrialsTab = 'map' | 'weather';

/**
 * 04 - Explore the Construction Sites / Interactive Trial Map & Weather Dashboard.
 *
 * The main interactive feature of the microsite. Map and dashboard live behind
 * a two-tab switch so neither has to fight the other for vertical space, and so
 * Leaflet only mounts once the visitor actually opens the map.
 */
@Component({
  selector: 'app-trials-section',
  imports: [TranslatePipe, SectionShell, TrialMap, WeatherDashboard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="trials"
      number="04"
      eyebrowKey="trials.eyebrow"
      titleKey="trials.title"
      leadKey="trials.lead"
      sectionClass="bg-sand-50"
    >
      <div role="tablist" class="mb-6 flex gap-2" [attr.aria-label]="'trials.tabsLabel' | translate">
        @for (t of tabs; track t) {
          <button
            type="button"
            role="tab"
            [id]="'tab-' + t"
            [attr.aria-selected]="tab() === t"
            [attr.aria-controls]="'panel-' + t"
            class="vx-btn"
            [class.bg-brand-700]="tab() === t"
            [class.text-white]="tab() === t"
            [class.border]="tab() !== t"
            [class.border-brand-700]="tab() !== t"
            [class.text-brand-700]="tab() !== t"
            (click)="tab.set(t)"
          >
            {{ 'trials.tab.' + t | translate }}
          </button>
        }
      </div>

      @if (tab() === 'map') {
        <div id="panel-map" role="tabpanel" aria-labelledby="tab-map">
          <app-trial-map />
        </div>
      } @else {
        <div id="panel-weather" role="tabpanel" aria-labelledby="tab-weather">
          <app-weather-dashboard />
        </div>
      }

      <p class="mt-6 text-[11px] leading-relaxed text-soil-700/80">
        {{ 'trials.source' | translate }}
      </p>
    </app-section-shell>
  `,
})
export class TrialsSection {
  protected readonly tabs: readonly TrialsTab[] = ['map', 'weather'];
  protected readonly tab = signal<TrialsTab>('map');
}
