import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MediaPlaceholder } from '../../shared/components/media-placeholder';
import { SectionShell } from '../../shared/components/section-shell';

/** 03 - Meet the Bio Engineers / How VIXERAN(R) Works. */
@Component({
  selector: 'app-bio-engineers-section',
  imports: [TranslatePipe, SectionShell, MediaPlaceholder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="bio-engineers"
      number="03"
      eyebrowKey="bioEngineers.eyebrow"
      titleKey="bioEngineers.title"
      sectionClass="bg-sand-50"
    >
      <div class="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <p class="max-w-xl text-base leading-relaxed text-soil-700">
            {{ 'bioEngineers.body1' | translate }}
          </p>
          <p class="mt-4 max-w-xl text-base leading-relaxed text-soil-700">
            {{ 'bioEngineers.body2' | translate }}
          </p>

          <!-- Mode of action: N2 -> NH4+ -> growth -->
          <ol class="mt-10 flex flex-wrap items-center gap-4">
            @for (step of modeOfAction; track step.formula; let last = $last) {
              <li class="flex items-center gap-4">
                <div class="flex w-32 flex-col items-center gap-2 text-center">
                  <span
                    class="flex h-16 w-16 items-center justify-center rounded-full border-2
                           border-brand-700 font-display text-lg font-bold text-brand-900"
                    [innerHTML]="step.formula"
                  ></span>
                  <span class="text-[11px] font-semibold uppercase leading-tight tracking-wider text-soil-700">
                    {{ step.labelKey | translate }}
                  </span>
                </div>
                @if (!last) {
                  <span aria-hidden="true" class="text-2xl text-brand-500">&rarr;</span>
                }
              </li>
            }
          </ol>
        </div>

        <div class="flex flex-col gap-6">
          <app-media-placeholder
            label="Mode of action illustration"
            hint="Azotobacter salinestris colonising the plant, magnifier + Bio Engineer"
            ratio="4 / 3"
          />

          <div class="vx-card">
            <h3 class="text-sm tracking-wider text-brand-900">
              {{ 'bioEngineers.benefitsTitle' | translate }}
            </h3>
            <ul class="mt-3 flex flex-col gap-2">
              @for (key of benefitKeys; track key) {
                <li class="flex items-start gap-2 text-sm text-soil-700">
                  <span aria-hidden="true" class="mt-0.5 text-brand-500">&check;</span>
                  <span>{{ key | translate }}</span>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </app-section-shell>
  `,
})
export class BioEngineersSection {
  protected readonly modeOfAction = [
    { formula: 'N<sub>2</sub>', labelKey: 'bioEngineers.moa.capture' },
    { formula: 'NH<sub>4</sub><sup>+</sup>', labelKey: 'bioEngineers.moa.convert' },
    { formula: '&#127793;', labelKey: 'bioEngineers.moa.growth' },
  ] as const;

  protected readonly benefitKeys = [
    'bioEngineers.benefits.nitrogen',
    'bioEngineers.benefits.establishment',
    'bioEngineers.benefits.roots',
    'bioEngineers.benefits.biomass',
    'bioEngineers.benefits.winter',
    'bioEngineers.benefits.spring',
  ] as const;
}
