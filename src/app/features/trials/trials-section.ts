import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../core/services/language.service';
import { TrialMap } from './trial-map/trial-map';

/**
 * 05 - Explore the Construction Sites / interactive trial map.
 *
 * Stage padding follows the same 1920 campaign grid as slide 04
 * (`vx-found-stage`): 191px left inset on the artboard, not `vx-container`.
 */
@Component({
  selector: 'app-trials-section',
  imports: [TranslatePipe, TrialMap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="trials" class="vx-slide relative">
      <img
        src="assets/all/slide-05/Micrositio-vixeran-FINAL-05.png"
        alt=""
        class="pointer-events-none absolute inset-0 size-full object-cover"
        loading="lazy"
        aria-hidden="true"
      />

      <div
        class="vx-trials-stage relative z-10 mx-auto flex h-full min-h-svh
               w-full max-w-[1920px] flex-col gap-8 px-5 pt-10 pb-16
               md:px-10 md:pt-12 md:pb-24"
      >
        <div class="vx-trials-copy max-w-4xl">
          <p class="vx-eyebrow">05. {{ 'trials.eyebrow' | translate }}</p>        
        </div>

        <app-trial-map />
      </div>
    </section>
  `,
})
export class TrialsSection {
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  protected readonly titleHtml = computed(() => {
    this.language.current();
    const text = String(this.translate.instant('trials.title'));
    return text.replace(/VIXERAN®/g, '<span class="text-brand-500">VIXERAN®</span>');
  });
}
