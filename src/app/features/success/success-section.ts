import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { TrialsService } from '../../core/services/trials.service';
import { MediaPlaceholder } from '../../shared/components/media-placeholder';
import { SectionShell } from '../../shared/components/section-shell';
import { StatTile } from '../../shared/components/stat-tile';

/** 05 - Building Success Across Europe / Grower & Expert Experiences. */
@Component({
  selector: 'app-success-section',
  imports: [TranslatePipe, SectionShell, StatTile, MediaPlaceholder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="success"
      number="05"
      eyebrowKey="success.eyebrow"
      titleKey="success.title"
      sectionClass="bg-white"
    >
      <div class="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-start">
        <ul class="grid gap-6 md:grid-cols-2">
          @for (t of testimonials; track t.quoteKey) {
            <li class="vx-card flex flex-col">
              <span aria-hidden="true" class="font-display text-4xl leading-none text-brand-300">
                &ldquo;
              </span>
              <blockquote class="mt-2 grow text-sm italic leading-relaxed text-soil-900">
                {{ t.quoteKey | translate }}
              </blockquote>
              <footer class="mt-5 border-t border-sand-200 pt-3">
                <p class="font-display text-xs font-semibold uppercase tracking-widest text-brand-900">
                  {{ t.roleKey | translate }}
                </p>
                <p class="text-xs text-soil-700">{{ t.originKey | translate }}</p>
              </footer>
            </li>
          }
        </ul>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <app-stat-tile [value]="trialCount()" labelKey="success.stats.trials" />
          <app-stat-tile [value]="seasonCount()" labelKey="success.stats.seasons" />
          <app-stat-tile [value]="countryCount()" labelKey="success.stats.countries" />
          <app-stat-tile
            [value]="positiveShare()"
            labelKey="success.stats.positive"
            noteKey="success.stats.positiveNote"
          />
        </div>
      </div>

      <div class="mt-10">
        <app-media-placeholder
          label="Field photography strip"
          hint="Established OSR crop, harvest + grower portraits"
          ratio="21 / 9"
        />
      </div>
    </app-section-shell>
  `,
})
export class SuccessSection {
  private readonly trialsService = inject(TrialsService);

  /**
   * Testimonials are placeholders until Marketing signs off the real quotes.
   * They read from i18n so each market can swap in its own grower.
   */
  protected readonly testimonials = [
    {
      quoteKey: 'success.testimonials.grower.quote',
      roleKey: 'success.testimonials.grower.role',
      originKey: 'success.testimonials.grower.origin',
    },
    {
      quoteKey: 'success.testimonials.expert.quote',
      roleKey: 'success.testimonials.expert.role',
      originKey: 'success.testimonials.expert.origin',
    },
  ] as const;

  protected readonly trialCount = computed(() => this.trialsService.kpis()?.trialCount ?? '—');
  protected readonly seasonCount = computed(() => this.trialsService.kpis()?.seasonCount ?? '—');
  protected readonly countryCount = computed(() => this.trialsService.kpis()?.countryCount ?? '—');

  /** Share of trials with a positive yield response, e.g. "21 / 40". */
  protected readonly positiveShare = computed(() => {
    const kpis = this.trialsService.kpis();
    return kpis ? `${kpis.positiveYieldTrials} / ${kpis.trialsWithYieldData}` : '—';
  });
}
