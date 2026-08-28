import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface Callout {
  icon: string;
  titleKey: string;
  bodyKey: string;
}

/**
 * 02 - How VIXERAN® works.
 *
 * Layout follows the 1920 campaign frame: copy on the dark soil at the left,
 * six glass callouts over the leaf, and the valve Bio Engineer at the bottom.
 */
@Component({
  selector: 'app-how-it-works-section',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="how-it-works"
      class="vx-slide relative"
    >
      <div
        class="vx-how-stage relative z-[2] mx-auto flex h-full min-h-svh
               w-full max-w-[1920px] flex-col justify-between gap-8 px-5 py-10
               md:px-10 md:py-12"
      >
        <div class="vx-how-copy max-w-xl">
          <p class="vx-eyebrow">02. {{ 'howItWorks.eyebrow' | translate }}</p>

          <h2
            class="vx-how-title mt-5 text-3xl font-semibold leading-[1.1] text-white
                   md:text-5xl md:leading-[1.1]"
          >
            {{ 'howItWorks.title' | translate }}
          </h2>

          <p
            class="vx-how-kicker mt-3 text-xl font-semibold leading-snug text-brand-500
                   md:text-3xl"
          >
            {{ 'howItWorks.kicker' | translate }}
          </p>

          <p
            class="vx-how-body mt-5 max-w-lg text-[14px] font-medium leading-[1.6] text-white
                   md:text-[16px]"
          >
            {{ 'howItWorks.body' | translate }}
            <em class="italic">{{ 'howItWorks.bodyEmphasis' | translate }}</em>
            {{ 'howItWorks.bodyRest' | translate }}
          </p>
        </div>

        <ul class="vx-how-grid grid w-full grid-cols-1 pt-10 sm:grid-cols-2">
          @for (callout of callouts; track callout.titleKey; let flip = $odd) {
            <li class="vx-how-card" [class.vx-how-card--flip]="flip">
              <div class="vx-how-fill" aria-hidden="true"></div>
              <img
                aria-hidden="true"
                class="vx-how-frame"
                src="assets/img/slide-02/card-frame.svg"
                alt=""
              />

              <span class="vx-how-icon" aria-hidden="true">
                <img
                  class="vx-how-icon-orb"
                  src="assets/all/slide-02/burbuja.webp"
                  alt=""
                />
                <img [src]="callout.icon" alt="" class="vx-how-icon-glyph" />
              </span>

              <div class="vx-how-card-copy">
                <div class="vx-how-card-copy-inner">
                  <h3>{{ callout.titleKey | translate }}</h3>
                  <p>{{ callout.bodyKey | translate }}</p>
                </div>
              </div>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class HowItWorksSection {
  protected readonly callouts: readonly Callout[] = [
    {
      icon: 'assets/all/slide-02/icon-01.svg',
      titleKey: 'howItWorks.callouts.air.title',
      bodyKey: 'howItWorks.callouts.air.body',
    },
    {
      icon: 'assets/all/slide-02/icon-02.svg',
      titleKey: 'howItWorks.callouts.fixation.title',
      bodyKey: 'howItWorks.callouts.fixation.body',
    },
    {
      icon: 'assets/all/slide-02/icon-03.svg',
      titleKey: 'howItWorks.callouts.biomass.title',
      bodyKey: 'howItWorks.callouts.biomass.body',
    },
    {
      icon: 'assets/all/slide-02/icon-04.svg',
      titleKey: 'howItWorks.callouts.plant.title',
      bodyKey: 'howItWorks.callouts.plant.body',
    },
    {
      icon: 'assets/all/slide-02/icon-05.svg',
      titleKey: 'howItWorks.callouts.establishment.title',
      bodyKey: 'howItWorks.callouts.establishment.body',
    },
    {
      icon: 'assets/all/slide-02/icon-06.svg',
      titleKey: 'howItWorks.callouts.winter.title',
      bodyKey: 'howItWorks.callouts.winter.body',
    },
  ];
}
