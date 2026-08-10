import { ChangeDetectionStrategy, Component, DOCUMENT, OnDestroy, inject, signal } from '@angular/core';
import { afterNextRender } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { JOURNEY_SECTIONS } from '../../core/models/section.model';

/**
 * The numbered 01-06 rail on the left of the storyboard.
 *
 * Highlights the section currently in the viewport using an IntersectionObserver
 * (no scroll listener, no layout thrashing).
 */
@Component({
  selector: 'app-journey-nav',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-side-nav shrink-0 overflow-y-auto
             border-r border-sand-200 pr-4 xl:block"
      [attr.aria-label]="'nav.journeyLabel' | translate"
    >
      <ol class="flex flex-col gap-6">
        @for (section of sections; track section.anchor) {
          <li>
            <a
              class="group block border-l-2 pl-3 transition-colors"
              [class.border-brand-700]="active() === section.anchor"
              [class.border-transparent]="active() !== section.anchor"
              [href]="'#' + section.anchor"
              [attr.aria-current]="active() === section.anchor ? 'true' : null"
            >
              <span
                class="font-display text-xs font-bold tracking-widest"
                [class.text-brand-700]="active() === section.anchor"
                [class.text-sand-300]="active() !== section.anchor"
              >
                {{ section.number }}
              </span>
              <span
                class="mt-1 block font-display text-[13px] font-semibold uppercase leading-tight
                       text-soil-900 group-hover:text-brand-700"
              >
                {{ section.titleKey | translate }}
              </span>
              <span class="mt-1 block text-[11px] leading-snug text-soil-700">
                {{ section.subtitleKey | translate }}
              </span>
            </a>
          </li>
        }
      </ol>
    </nav>
  `,
})
export class JourneyNav implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private observer?: IntersectionObserver;

  protected readonly sections = JOURNEY_SECTIONS;
  protected readonly active = signal<string>(JOURNEY_SECTIONS[0].anchor);

  constructor() {
    afterNextRender(() => this.observe());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private observe(): void {
    const targets = JOURNEY_SECTIONS.map((s) => this.document.getElementById(s.anchor)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!targets.length || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          this.active.set(visible.target.id);
        }
      },
      // Bias towards the upper third of the viewport so the highlight moves
      // when a section's heading reaches the top, not when it fills the screen.
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] },
    );

    targets.forEach((target) => this.observer?.observe(target));
  }
}
