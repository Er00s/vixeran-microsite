import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { NAV_SECTIONS } from '../../core/models/section.model';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

/**
 * Olive band across the top of the page: VIXERAN logo, the six journey pills,
 * the language switcher and the Syngenta Biologicals lock-up. The bar is fixed
 * so the first slide photo runs underneath the wave (no ink gap in the curve).
 *
 * The pill of the section currently in the viewport is filled in green. This
 * replaces the numbered side rail of the previous design, so the highlight
 * logic lives here now.
 */
@Component({
  selector: 'app-site-header',
  imports: [TranslatePipe, LanguageSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <header
      class="vx-site-header pointer-events-none fixed inset-x-0 top-0 z-40 overflow-visible"
      [class.vx-header-away]="away()"
      [attr.inert]="away() ? true : null"
      style="min-height: var(--spacing-header)"
    >
      <!--
        Organic olive plate traced from slide-01/headerbg.png (1920×351, #6F7F29).
        The PNG is the right shape, but stretching that raster would pixelate the
        wave and it has a dark fringe on the alpha edge — so the curve lives in
        an SVG that hangs below the nav bar and over the slide photo.
      -->
      <img
        aria-hidden="true"
        class="vx-header-plate pointer-events-none absolute inset-x-0 top-0 z-0
               w-full select-none"
        src="assets/all/slide-01/header-plate.svg"
        alt=""
      />

      <img
        aria-hidden="true"
        class="vx-header-dots pointer-events-none absolute top-0 right-0 z-1
               select-none"
        src="assets/vectores/topcircles.png"
        alt=""
      />

      <div
        class="vx-header-inner pointer-events-auto relative z-2 mx-auto flex
               min-h-header w-full max-w-[1920px] items-center justify-between gap-3 px-3 pb-2 md:pb-0 md:px-5 xl:px-8"
      >
        <a href="#welcome" class="vx-header-logo-link flex shrink-0 items-center" (click)="reveal()">
          <img
            class="vx-header-logo h-7 w-auto sm:h-8 md:h-9"
            src="assets/logos/vixeran-rgb-large.png"
            alt="VIXERAN®"
          />
        </a>

        <nav
          class="vx-header-nav vx-desk-block hidden min-w-0 flex-1 items-center "
          [attr.aria-label]="'header.navLabel' | translate"
        >
          <ul class="flex min-w-0 items-center justify-center gap-1.5 lg:gap-2 xl:gap-2.5">
            @for (section of sections; track section.anchor) {
              <li>
                <a
                  class="flex items-center rounded-full px-3.5 py-1.5 text-[14px] lg:text-[15px] font-medium
                         leading-none whitespace-nowrap transition-colors"
                  [class]="
                    active() === section.anchor
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-white/85 hover:bg-white/15 hover:text-white'
                  "
                  [href]="'#' + section.anchor"
                  [attr.aria-current]="active() === section.anchor ? 'true' : null"
                  (click)="hideForSection()"
                >
                  {{ section.shortKey | translate }}
                </a>
              </li>
            }
            <li class="vx-header-lang shrink-0 self-center ml-1 lg:ml-2">
              <app-language-switcher />
            </li>
          </ul>
        </nav>

        <div class="vx-header-right flex shrink-0 items-center gap-3">
          <div class="vx-header-syngenta-wrap hidden items-center sm:flex">
            <img
              class="vx-header-syngenta h-7 w-auto sm:h-8 md:h-9"
              src="assets/vectores/syngentabiologicals.png"
              alt="Syngenta Biologicals"
            />
          </div>

          <div class="vx-desk-hidden flex items-center gap-2">
            <app-language-switcher />

            <button
              type="button"
              class="rounded-full border border-white/40 p-2 text-white"
              [attr.aria-expanded]="menuOpen()"
              aria-controls="mobile-nav"
              (click)="toggle()"
            >
              <span class="sr-only">{{ 'header.menu' | translate }}</span>
              <span aria-hidden="true" class="block h-0.5 w-5 bg-current"></span>
              <span aria-hidden="true" class="mt-1 block h-0.5 w-5 bg-current"></span>
              <span aria-hidden="true" class="mt-1 block h-0.5 w-5 bg-current"></span>
            </button>
          </div>
        </div>
      </div>

      @if (menuOpen()) {
        <nav
          id="mobile-nav"
          class="vx-desk-hidden pointer-events-auto relative -top-6 z-5 border-t border-white/20 bg-moss-500 pt-2.5"
          [attr.aria-label]="'header.navLabel' | translate"
        >
          <ul class="vx-container flex flex-col py-2">
            @for (section of sections; track section.anchor) {
              <li>
                <a
                  class="flex items-baseline gap-3 py-2.5 text-sm text-white"
                  [href]="'#' + section.anchor"
                  (click)="hideForSection()"
                >
                  <span class="text-xs font-semibold text-brand-300">{{ section.number }}</span>
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
export class SiteHeader implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;
  private observer?: IntersectionObserver;
  private lastY = 0;
  private directionLocked = false;
  private directionLockTimer = 0;

  protected readonly sections = NAV_SECTIONS;
  protected readonly menuOpen = signal(false);
  protected readonly active = signal<string>('');
  protected readonly away = signal(false);

  constructor() {
    afterNextRender(() => {
      this.observe();
      this.bindScroll();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.window?.clearTimeout(this.directionLockTimer);
    this.window?.removeEventListener('scroll', this.onScroll);
  }

  protected toggle(): void {
    this.menuOpen.update((open) => !open);
    if (this.menuOpen()) {
      this.away.set(false);
    }
  }

  protected close(): void {
    this.menuOpen.set(false);
  }

  protected reveal(): void {
    this.away.set(false);
    this.menuOpen.set(false);
  }

  protected hideForSection(): void {
    this.menuOpen.set(false);
    this.away.set(true);
    this.lockDirection();
  }

  private observe(): void {
    const targets = NAV_SECTIONS.map((s) => this.document.getElementById(s.anchor)).filter(
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
      // Bias towards the upper third of the viewport so the highlight moves when
      // a section's heading reaches the top, not when it fills the screen.
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] },
    );

    targets.forEach((target) => this.observer?.observe(target));
  }

  private bindScroll(): void {
    if (!this.window) {
      return;
    }
    this.lastY = this.window.scrollY;
    this.window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  private readonly onScroll = (): void => {
    const y = this.window?.scrollY ?? 0;
    if (this.directionLocked) {
      this.lastY = y;
      return;
    }

    if (y <= 16) {
      this.away.set(false);
    } else if (y > this.lastY + 6) {
      this.away.set(true);
      this.menuOpen.set(false);
    } else if (y < this.lastY - 6) {
      this.away.set(false);
    }

    this.lastY = y;
  };

  private lockDirection(): void {
    this.directionLocked = true;
    this.window?.clearTimeout(this.directionLockTimer);
    this.directionLockTimer = this.window?.setTimeout(() => {
      this.directionLocked = false;
      this.lastY = this.window?.scrollY ?? this.lastY;
    }, 900) ?? 0;
  }
}
