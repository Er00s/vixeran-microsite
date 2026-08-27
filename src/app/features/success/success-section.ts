import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { TrialsService } from '../../core/services/trials.service';
import { MediaPlaceholder } from '../../shared/components/media-placeholder';
import { SectionShell } from '../../shared/components/section-shell';
import { StatTile } from '../../shared/components/stat-tile';

/** 07 - Building success across Europe / Grower & Expert Experiences. */
@Component({
  selector: 'app-success-section',
  imports: [TranslatePipe, SectionShell, StatTile, MediaPlaceholder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="success"
      number="07"
      eyebrowKey="success.eyebrow"
      titleKey="success.title"
      leadKey="success.lead"
      tone="photo"
      background="assets/img/bg7.png"
      sectionClass="vx-slide-bg"
    >
      <ul class="grid gap-6 md:grid-cols-2">
        @for (t of testimonials; track t.quoteKey) {
          <li class="vx-glass-card flex min-h-80 flex-col bg-ink-900/60">
            <div class="mb-5 h-40 overflow-hidden rounded-xl">
              <app-media-placeholder [label]="t.photoLabel" hint="Portrait still, 4:5" ratio="16 / 9" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-widest text-white">
              {{ t.roleKey | translate }}
              <span class="text-mist-300"> {{ t.originKey | translate }}</span>
            </p>
            <blockquote class="mt-3 grow text-sm leading-relaxed text-mist-100">
              {{ t.quoteKey | translate }}
            </blockquote>
          </li>
        }
      </ul>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <app-stat-tile [value]="trialCount()" labelKey="success.stats.trials" />
        <app-stat-tile [value]="seasonCount()" labelKey="success.stats.seasons" />
        <app-stat-tile [value]="countryCount()" labelKey="success.stats.countries" />
        <app-stat-tile
          [value]="positiveShare()"
          labelKey="success.stats.positive"
          noteKey="success.stats.positiveNote"
        />
      </div>
    </app-section-shell>
  `,
})
export class SuccessSection {
  private readonly trialsService = inject(TrialsService);

  protected readonly testimonials = [
    {
      quoteKey: 'success.testimonials.grower.quote',
      roleKey: 'success.testimonials.grower.role',
      originKey: 'success.testimonials.grower.origin',
      photoLabel: 'Grower portrait',
    },
    {
      quoteKey: 'success.testimonials.expert.quote',
      roleKey: 'success.testimonials.expert.role',
      originKey: 'success.testimonials.expert.origin',
      photoLabel: 'Syngenta expert portrait',
    },
  ] as const;

  protected readonly trialCount = computed(() => this.trialsService.kpis()?.trialCount ?? '—');
  protected readonly seasonCount = computed(() => this.trialsService.kpis()?.seasonCount ?? '—');
  protected readonly countryCount = computed(() => this.trialsService.kpis()?.countryCount ?? '—');

  protected readonly positiveShare = computed(() => {
    const kpis = this.trialsService.kpis();
    return kpis ? `${kpis.positiveYieldTrials} / ${kpis.trialsWithYieldData}` : '—';
  });
}
