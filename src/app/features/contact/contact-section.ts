import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { SectionShell } from '../../shared/components/section-shell';

/**
 * 08 - Ready to build with VIXERAN®?
 *
 * Closing CTA as in the Figma: pill, headline, lead and a single button.
 */
@Component({
  selector: 'app-contact-section',
  imports: [TranslatePipe, SectionShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="contact"
      number="08"
      eyebrowKey="contact.eyebrow"
      titleKey="contact.title"
      leadKey="contact.lead"
      tone="photo"
      align="center"
      background="assets/img/bg8.png"
      sectionClass="vx-slide-bg"
    >
      <div class="flex justify-center">
        <button
          type="button"
          class="vx-btn-primary h-12 px-10 text-sm md:h-[92px] md:w-[469px] md:px-0
                 md:text-[29px] md:leading-[29px] md:tracking-[-0.58px]"
        >
          {{ 'contact.cta' | translate }}
        </button>
      </div>
    </app-section-shell>
  `,
})
export class ContactSection {}
