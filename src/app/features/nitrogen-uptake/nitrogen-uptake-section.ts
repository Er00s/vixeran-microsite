import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { SectionShell } from '../../shared/components/section-shell';

/**
 * 06 - How VIXERAN® enhances crop nitrogen uptake.
 *
 * Copy sits on the left; the MoA video sits beside the body, over the
 * nodule / Bio Engineer still (bg6).
 */
@Component({
  selector: 'app-nitrogen-uptake-section',
  imports: [SectionShell, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="nitrogen-uptake"
      number="06"
      eyebrowKey="nitrogenUptake.eyebrow"
      titleKey="nitrogenUptake.title"
      background="assets/img/bg6.png"
      backgroundPosition="right center"
      sectionClass="vx-slide-bg"
      contentClass="!mt-4"
    >
      <div class="grid items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
        <p
          class="text-base leading-relaxed text-mist-300 md:text-[17px] md:leading-[1.75]"
        >
          {{ 'nitrogenUptake.body' | translate }}
        </p>

        <div
          class="vx-drive-embed w-full min-w-0 rounded-[20px] bg-ink-950
                 shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
        >
          <iframe
            src="https://drive.google.com/file/d/1kpS-FD0ew360IecqTOwPVWyB77nIrJS8/preview"
            allow="autoplay; fullscreen"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            [title]="'nitrogenUptake.videoLabel' | translate"
            [attr.aria-label]="'nitrogenUptake.videoLabel' | translate"
          ></iframe>
        </div>
      </div>
    </app-section-shell>
  `,
})
export class NitrogenUptakeSection {}
