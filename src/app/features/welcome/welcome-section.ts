import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { NitrogenBubbles } from '../../shared/components/nitrogen-bubbles';

/**
 * 01 - Autumn is Building Season.
 *
 * Positions and type sizes are taken from Figma SLIDE-01 (1920 artboard):
 *   headline  191,278  496×272  → 91px / 91px leading
 *   subhead   195,563  489×90   → 37px / 45px leading, 13px below headline
 *   body      421,1044 974×270  → 17px, top-aligned with the CTA
 *   CTA       1409,1045 413×77  → 22px SemiBold, tracking -0.44px
 *
 * The `vx-hero-*` classes (styles.css) apply those values from 1800px up.
 */
@Component({
  selector: 'app-welcome-section',
  imports: [TranslatePipe, NitrogenBubbles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="welcome"
      class="vx-slide relative"
    >
      <img
        src="assets/img/bg1.png"
        class="absolute inset-0 size-full object-cover"
        fetchpriority="high"
        [attr.alt]="'welcome.visualLabel' | translate"
      />

      <img
        aria-hidden="true"
        class="vx-hero-minion pointer-events-none absolute bottom-0 left-4 z-[1]
               w-40 select-none md:left-6 md:w-64"
        src="assets/img/minion1.png"
        alt=""
      />

      <app-nitrogen-bubbles class="vx-hero-bubbles" />

      <div
        class="vx-hero-stage relative z-[2] mx-auto flex h-full min-h-svh w-full max-w-[1920px]
               flex-col px-5 pb-5 md:justify-between md:px-10 md:pb-6"
      >
        <div class="vx-hero-copy max-w-[32rem]">
          <h1
            class="vx-hero-title text-[2.75rem] font-medium leading-[0.95] tracking-normal
                   text-olive-600 md:text-6xl md:leading-[0.95]"
          >
            {{ 'welcome.headlineTop' | translate }}<br />
            {{ 'welcome.headlineMid' | translate }}<br />
            {{ 'welcome.headlineBottom' | translate }}
          </h1>

          <p
            class="vx-hero-sub mt-3 max-w-[32rem] text-xl font-semibold leading-snug
                   text-soil-900 md:text-3xl"
          >
            {{ 'welcome.subheadline' | translate }}
          </p>
        </div>

        <div
          class="vx-hero-bottom ml-auto flex w-full flex-col items-stretch gap-6 pt-8
                 sm:items-end md:pt-10 lg:flex-row lg:items-center lg:justify-end lg:gap-6"
        >
          <p
            class="vx-hero-intro max-w-xl text-[14px] font-semibold leading-[1.6] text-white
                   lg:max-w-[1000px] lg:flex-1"
          >
            {{ 'welcome.intro' | translate }}
            <em class="italic">{{ 'welcome.introEmphasis' | translate }}</em>
            {{ 'welcome.introRest' | translate }}
          </p>

          <a
            href="#how-it-works"
            class="vx-hero-cta vx-btn-primary self-end h-10 w-fit shrink-0 px-6 text-xs leading-none
                   md:h-11 md:px-7 md:text-sm"
          >
            {{ 'welcome.cta' | translate }}
          </a>
        </div>
      </div>
    </section>
  `,
})
export class WelcomeSection {}
