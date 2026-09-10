import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { SpeciesItalicPipe } from '../../shared/pipes/species-italic.pipe';

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
  imports: [TranslatePipe, SpeciesItalicPipe],
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
            class="vx-how-body mt-5 max-w-lg text-lg font-medium leading-[1.6] text-white
                   md:text-2xl"
            [innerHTML]="
              ((('howItWorks.body' | translate) +
                ('howItWorks.bodyEmphasis' | translate) +
                ('howItWorks.bodyRest' | translate))
                | speciesItalic)
            "
          ></p>
        </div>

        <ul class="vx-how-grid grid w-full grid-cols-1 pt-10 sm:grid-cols-2">
          @for (callout of callouts; track callout.titleKey; let flip = $odd; let first = $first) {
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
                <img
                  [src]="callout.icon"
                  alt=""
                  class="vx-how-icon-glyph"
                  [class.vx-how-icon-glyph--full]="first"
                />
              </span>

              <div class="vx-how-card-copy">
                <div class="vx-how-card-copy-inner" #copyInner>
                  <h3>{{ callout.titleKey | translate }}.</h3>
                  <p>{{ callout.bodyKey | translate }}.</p>
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly copyInners = viewChildren<ElementRef<HTMLElement>>('copyInner');

  private fitRaf = 0;
  private resizeObserver: ResizeObserver | null = null;

  protected readonly callouts: readonly Callout[] = [
    {
      icon: 'assets/all/slide-03/icon-01.svg',
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

  constructor() {
    afterNextRender(() => {
      this.observeAndFit();
      this.translate.onLangChange
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.scheduleFit());
    });

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.fitRaf);
      this.resizeObserver?.disconnect();
    });
  }

  private observeAndFit(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.scheduleFit());

    for (const ref of this.copyInners()) {
      const box = ref.nativeElement.parentElement;
      if (box) {
        this.resizeObserver.observe(box);
      }
    }

    this.scheduleFit();
  }

  private scheduleFit(): void {
    cancelAnimationFrame(this.fitRaf);
    this.fitRaf = requestAnimationFrame(() => {
      // Second frame: wait for translated DOM text to settle after lang change.
      this.fitRaf = requestAnimationFrame(() => this.fitAll());
    });
  }

  private fitAll(): void {
    for (const ref of this.copyInners()) {
      this.fitCopy(ref.nativeElement);
    }
  }

  /** Binary-search the largest --vx-how-fit ≤ 1 that keeps copy inside the frame. */
  private fitCopy(inner: HTMLElement): void {
    const box = inner.parentElement;
    if (!box) {
      return;
    }

    const fits = (scale: number): boolean => {
      inner.style.setProperty('--vx-how-fit', String(scale));
      return (
        inner.scrollHeight <= box.clientHeight + 0.5 &&
        inner.scrollWidth <= box.clientWidth + 0.5
      );
    };

    if (fits(1)) {
      return;
    }

    let lo = 0.45;
    let hi = 1;
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    inner.style.setProperty('--vx-how-fit', String(lo));
  }
}
