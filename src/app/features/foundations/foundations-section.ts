import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { NitrogenBubbles } from '../../shared/components/nitrogen-bubbles';
import { EstablishmentCard } from './cards/establishment-card';
import { SpringCard } from './cards/spring-card';
import { StabilityCard } from './cards/stability-card';
import { WinterCard } from './cards/winter-card';

/**
 * 04 - Lay the Foundations / Why autumn establishment matters.
 *
 * Full-bleed sunrise plate with copy on the sky (top left) and four
 * independent flip cards along the soil band.
 */
@Component({
  selector: 'app-foundations-section',
  imports: [TranslatePipe, NitrogenBubbles, EstablishmentCard, StabilityCard, WinterCard, SpringCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="foundations"
      class="vx-slide relative overflow-hidden"
    >
      <img
        src="assets/all/slide-04/fondo.webp"
        class="absolute inset-0 size-full object-cover object-[center_top]"
        loading="lazy"
        alt=""
        aria-hidden="true"
      />

      <app-nitrogen-bubbles class="vx-found-bubbles" />

      <div
        class="vx-found-stage relative mx-auto flex h-full min-h-svh
               w-full max-w-[1920px] flex-col justify-between gap-8 px-5 pt-10 pb-16
               md:px-10 md:pt-12 md:pb-24"
      >
        <div class="vx-found-copy max-w-xl">
          <p class="vx-eyebrow">04. {{ 'foundations.eyebrow' | translate }}</p>

          <h2
            class="vx-found-title mt-5 text-3xl font-semibold leading-[1.1] text-soil-900
                   md:text-5xl md:leading-[1.1]"
          >
            {{ 'foundations.title' | translate }}
          </h2>

          <p
            class="vx-found-lead mt-3 max-w-lg text-lg font-semibold leading-snug text-soil-900
                   md:text-2xl"
          >
            {{ 'foundations.lead' | translate }}
          </p>
        </div>

        <ul class="vx-found-grid grid w-full grid-cols-2 gap-3 sm:gap-4">
          <li>
            <app-establishment-card />
          </li>
          <li>
            <app-stability-card />
          </li>
          <li>
            <app-winter-card />
          </li>
          <li>
            <app-spring-card />
          </li>
        </ul>
      </div>
    </section>
  `,
})
export class FoundationsSection {}
