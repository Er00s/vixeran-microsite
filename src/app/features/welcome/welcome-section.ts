import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MediaPlaceholder } from '../../shared/components/media-placeholder';

/**
 * 01 - Welcome to the Building Site / Autumn is Building Season.
 *
 * Full-bleed hero. Deliberately does NOT use SectionShell: the hero owns its
 * own layout so the Key Visual can bleed to the edges.
 */
@Component({
  selector: 'app-welcome-section',
  imports: [TranslatePipe, MediaPlaceholder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="welcome" class="relative scroll-mt-20 overflow-hidden bg-sand-100">
      <!-- Campaign Key Visual. Replace with <picture> once artwork lands. -->
      <div class="absolute inset-0 -z-10 opacity-40">
        <app-media-placeholder
          label="Hero Key Visual"
          hint="Bio Engineers on the construction site, 2560x1200, .webp + .avif"
          ratio="auto"
        />
      </div>

      <div class="vx-container grid gap-10 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p class="vx-eyebrow"><span class="mr-2 text-sand-300">01</span>{{ 'welcome.eyebrow' | translate }}</p>

          <h1 class="mt-3 text-5xl leading-[0.92] text-brand-900 md:text-7xl xl:text-8xl">
            {{ 'welcome.headlineTop' | translate }}<br />
            <span class="text-brand-700">{{ 'welcome.headlineBottom' | translate }}</span>
          </h1>

          <p class="mt-6 max-w-xl font-display text-xl font-medium text-soil-900 md:text-2xl">
            {{ 'welcome.subheadline' | translate }}
          </p>

          <p class="mt-4 max-w-xl text-base leading-relaxed text-soil-700">
            {{ 'welcome.intro' | translate }}
          </p>

          <a href="#bio-engineers" class="vx-btn-primary mt-8">
            {{ 'welcome.cta' | translate }}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <app-media-placeholder
          label="Hero illustration"
          hint="Crop + Bio Engineers cut-out, transparent PNG/WebP"
          ratio="4 / 3"
        />
      </div>
    </section>
  `,
})
export class WelcomeSection {}
