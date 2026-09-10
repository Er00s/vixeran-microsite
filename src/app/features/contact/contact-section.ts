import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../core/services/language.service';

/**
 * 08 - Ready to build with VIXERAN®?
 *
 * Shares the rapeseed plate with slide 07 via `.vx-flow-07-08` in home
 * (lower green wash of the shared plate). Closing CTA: pill, headline,
 * lead and a single button.
 */
@Component({
  selector: 'app-contact-section',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="contact"
      class="vx-slide relative flex min-h-svh flex-col justify-center overflow-hidden
             pt-16 pb-40 md:pt-24 md:pb-52 lg:pb-44 xl:pb-40 2xl:pb-24"
    >
      <img
        aria-hidden="true"
        class="vx-contact-minion pointer-events-none absolute bottom-0 left-2 z-1
               w-52 select-none translate-y-[21.2%] sm:w-56 md:left-6 md:w-56 lg:left-8 lg:w-72 xl:left-14 xl:w-96 2xl:w-140"
        src="assets/img/minion3.webp"
        alt=""
      />

      <div class="vx-container relative z-10 text-center">
        <p class="vx-eyebrow mx-auto">
          08. {{ 'contact.eyebrow' | translate }}
        </p>

        <h2
          class="mx-auto mt-5 max-w-4xl text-3xl leading-[1.1] text-white md:text-[60px] md:leading-[69px]"
          [innerHTML]="titleHtml()"
        ></h2>

        <p
          class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white md:text-[17px] md:leading-[1.75]"
        >
          {{ 'contact.lead' | translate }}
        </p>

        <p
          class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white md:text-[17px] md:leading-[1.75]"
        >
          {{ 'contact.lead2' | translate }}
        </p>

        <div class="mt-10 flex justify-center">
          <button
            type="button"
            class="vx-btn-primary h-12 px-10 text-sm md:h-[92px] md:w-[469px] md:px-0
                   md:text-[29px] md:leading-[29px] md:tracking-[-0.58px]"
          >
            {{ 'contact.cta' | translate }}
          </button>
        </div>
      </div>
    </section>
  `,
})
export class ContactSection {
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  protected readonly titleHtml = computed(() => {
    this.language.current();
    const text = String(this.translate.instant('contact.title'));
    return text.replace(/VIXERAN®/g, '<span class="text-brand-500">VIXERAN®</span>');
  });
}
