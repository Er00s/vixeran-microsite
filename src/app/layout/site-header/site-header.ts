import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { JOURNEY_SECTIONS } from '../../core/models/section.model';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

/**
 * Sticky top bar: VIXERAN logo, the six journey anchors and the language
 * switcher. Collapses to a burger menu below `md`.
 */
@Component({
  selector: 'app-site-header',
  imports: [TranslatePipe, LanguageSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur">
      <div class="vx-container flex h-16 items-center justify-between gap-4">
        <a href="#welcome" class="flex flex-col leading-none">
          <span class="font-display text-2xl font-bold tracking-tight text-brand-900">
            Vixeran<sup class="text-[0.6em]">&reg;</sup>
          </span>
          <span class="text-[10px] uppercase tracking-[0.2em] text-brand-700">
            {{ 'header.tagline' | translate }}
          </span>
        </a>

        <nav class="hidden lg:block" [attr.aria-label]="'header.navLabel' | translate">
          <ul class="flex items-center gap-6">
            @for (section of sections; track section.anchor) {
              <li>
                <a
                  class="font-display text-xs font-semibold uppercase tracking-widest
                         text-soil-900 transition-colors hover:text-brand-700"
                  [href]="'#' + section.anchor"
                >
                  {{ section.shortKey | translate }}
                </a>
              </li>
            }
          </ul>
        </nav>

        <div class="flex items-center gap-3">
          <app-language-switcher />
          <button
            type="button"
            class="lg:hidden rounded-sm border border-sand-300 px-3 py-2"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-nav"
            (click)="toggle()"
          >
            <span class="sr-only">{{ 'header.menu' | translate }}</span>
            <span aria-hidden="true" class="block h-0.5 w-5 bg-brand-900"></span>
            <span aria-hidden="true" class="mt-1 block h-0.5 w-5 bg-brand-900"></span>
            <span aria-hidden="true" class="mt-1 block h-0.5 w-5 bg-brand-900"></span>
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <nav
          id="mobile-nav"
          class="border-t border-sand-200 bg-sand-50 lg:hidden"
          [attr.aria-label]="'header.navLabel' | translate"
        >
          <ul class="vx-container flex flex-col py-2">
            @for (section of sections; track section.anchor) {
              <li>
                <a
                  class="flex items-baseline gap-3 py-2 font-display text-sm uppercase tracking-widest"
                  [href]="'#' + section.anchor"
                  (click)="close()"
                >
                  <span class="text-brand-500">{{ section.number }}</span>
                  <span>{{ section.shortKey | translate }}</span>
                </a>
              </li>
            }
          </ul>
        </nav>
      }
    </header>
  `,
})
export class SiteHeader {
  protected readonly sections = JOURNEY_SECTIONS;
  protected readonly menuOpen = signal(false);

  protected toggle(): void {
    this.menuOpen.update((open) => !open);
  }

  protected close(): void {
    this.menuOpen.set(false);
  }
}
