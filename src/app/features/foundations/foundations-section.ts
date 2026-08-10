import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MediaPlaceholder } from '../../shared/components/media-placeholder';
import { SectionShell } from '../../shared/components/section-shell';

interface FoundationPillar {
  icon: string;
  titleKey: string;
  bodyKey: string;
}

/** 02 - Lay the Foundations / Why Autumn Establishment Matters. */
@Component({
  selector: 'app-foundations-section',
  imports: [TranslatePipe, SectionShell, MediaPlaceholder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="foundations"
      number="02"
      eyebrowKey="foundations.eyebrow"
      titleKey="foundations.title"
      leadKey="foundations.lead"
      sectionClass="bg-white"
    >
      <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <ul class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          @for (pillar of pillars; track pillar.titleKey) {
            <li class="border-l border-sand-200 pl-4">
              <app-media-placeholder [label]="pillar.icon" ratio="1 / 1" />
              <h3 class="mt-4 text-base leading-tight text-brand-900">
                {{ pillar.titleKey | translate }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-soil-700">
                {{ pillar.bodyKey | translate }}
              </p>
            </li>
          }
        </ul>

        <app-media-placeholder
          label="Underground root illustration"
          hint="Soil cross-section with roots + Bio Engineers"
          ratio="3 / 4"
        />
      </div>
    </app-section-shell>
  `,
})
export class FoundationsSection {
  /**
   * The four establishment pillars from the approved structure. Copy lives in
   * the i18n files; only the ordering and the icon slot are structural.
   */
  protected readonly pillars: readonly FoundationPillar[] = [
    {
      icon: 'Icon: root system',
      titleKey: 'foundations.pillars.roots.title',
      bodyKey: 'foundations.pillars.roots.body',
    },
    {
      icon: 'Icon: biomass',
      titleKey: 'foundations.pillars.biomass.title',
      bodyKey: 'foundations.pillars.biomass.body',
    },
    {
      icon: 'Icon: snowflake',
      titleKey: 'foundations.pillars.winter.title',
      bodyKey: 'foundations.pillars.winter.body',
    },
    {
      icon: 'Icon: spring shoot',
      titleKey: 'foundations.pillars.spring.title',
      bodyKey: 'foundations.pillars.spring.body',
    },
  ];
}
