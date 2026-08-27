import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../core/services/language.service';

type SectionTone = 'ink' | 'photo' | 'brand';
type SectionAlign = 'start' | 'center';

/**
 * Common chrome for every journey section: green numbered pill, headline,
 * optional kicker / lead, then projected content.
 *
 * `tone` switches type colour so the same shell works on the dark canvas,
 * over a photograph, or on the closing green CTA.
 */
@Component({
  selector: 'app-section-shell',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [id]="anchor()" class="vx-section" [class]="sectionClass()">
      @if (background()) {
        <img
          [src]="background()!"
          alt=""
          class="pointer-events-none absolute inset-0 size-full object-cover"
          [style.object-position]="backgroundPosition()"
          loading="lazy"
          aria-hidden="true"
        />
      }
      @if (scrimClass()) {
        <div class="pointer-events-none absolute inset-0" [class]="scrimClass()"></div>
      }
      <div class="vx-container relative z-10" [class.text-center]="align() === 'center'">
        <p class="vx-eyebrow" [class.mx-auto]="align() === 'center'">
          {{ number() }}. {{ eyebrowKey() | translate }}
        </p>

        @if (kickerKey()) {
          <p
            class="mt-6 max-w-2xl text-lg font-medium text-brand-400 md:text-[32px] md:leading-[32px]"
            [class.mx-auto]="align() === 'center'"
          >
            {{ kickerKey()! | translate }}
          </p>
        }

        <h2
          class="mt-5 max-w-4xl text-3xl leading-[1.1] md:text-[60px] md:leading-[69px]"
          [class]="titleClass()"
          [class.mx-auto]="align() === 'center'"
          [innerHTML]="titleHtml()"
        ></h2>

        @if (leadKey()) {
          <p
            class="mt-4 max-w-2xl text-base leading-relaxed md:text-[17px] md:leading-[1.75]"
            [class]="leadClass()"
            [class.mx-auto]="align() === 'center'"
          >
            {{ leadKey()! | translate }}
          </p>
        }

        <div class="has-[*]:mt-10" [class]="contentClass()">
          <ng-content />
        </div>
      </div>
    </section>
  `,
})
export class SectionShell {
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  readonly anchor = input.required<string>();
  readonly number = input.required<string>();
  readonly eyebrowKey = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly kickerKey = input<string | null>(null);
  readonly leadKey = input<string | null>(null);
  readonly sectionClass = input<string>('bg-ink-900');
  readonly tone = input<SectionTone>('ink');
  readonly align = input<SectionAlign>('start');
  /** Full-bleed section artwork (`/assets/img/bgN.png`). Decorative; hidden from AT. */
  readonly background = input<string | null>(null);
  readonly backgroundPosition = input<string>('center');
  /** Optional overlay so type stays readable on a bright photograph. */
  readonly scrimClass = input<string | null>(null);
  /** Extra classes for the projected-content wrapper (e.g. tighter spacing). */
  readonly contentClass = input<string>('');

  protected readonly titleClass = computed(() =>
    this.tone() === 'photo' ? 'text-soil-900' : 'text-white',
  );

  protected readonly titleHtml = computed(() => {
    this.language.current();
    const text = String(this.translate.instant(this.titleKey()));
    return text.replace(/VIXERAN®/g, '<span class="text-brand-500">VIXERAN®</span>');
  });

  protected readonly leadClass = computed(() => {
    if (this.tone() === 'photo') return 'text-soil-900';
    if (this.tone() === 'brand') return 'text-white';
    return 'text-mist-300';
  });
}
