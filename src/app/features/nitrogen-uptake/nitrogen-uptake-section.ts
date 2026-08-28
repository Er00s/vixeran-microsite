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
      background="assets/all/slide-06/Micrositio-vixeran-FINAL-06.png"
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
          class="vx-video-embed w-full min-w-0 rounded-[20px] bg-ink-950
                 shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
        >
          <iframe
            src="https://player.vimeo.com/video/1222106701?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;title=0&amp;byline=0&amp;portrait=0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
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
