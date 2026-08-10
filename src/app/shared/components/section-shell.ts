import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Common chrome for every journey section: the "02 / LAY THE FOUNDATIONS"
 * eyebrow, the content-focus headline and an optional lead paragraph.
 *
 * Keeping this in one place is what makes the six sections look like one
 * campaign instead of six pages.
 */
@Component({
  selector: 'app-section-shell',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [id]="anchor()" class="vx-section" [class]="sectionClass()">
      <div class="vx-container">
        <p class="vx-eyebrow">
          <span class="mr-2 text-sand-300">{{ number() }}</span>{{ eyebrowKey() | translate }}
        </p>

        <h2 class="mt-2 max-w-3xl text-3xl leading-[1.05] text-brand-900 md:text-5xl">
          {{ titleKey() | translate }}
        </h2>

        @if (leadKey()) {
          <p class="mt-4 max-w-2xl text-base leading-relaxed text-soil-700 md:text-lg">
            {{ leadKey()! | translate }}
          </p>
        }

        <div class="mt-10">
          <ng-content />
        </div>
      </div>
    </section>
  `,
})
export class SectionShell {
  /** DOM id / scroll anchor, e.g. "foundations". */
  readonly anchor = input.required<string>();
  /** "01" ... "06" */
  readonly number = input.required<string>();
  /** i18n key for the campaign-experience eyebrow. */
  readonly eyebrowKey = input.required<string>();
  /** i18n key for the content-focus headline. */
  readonly titleKey = input.required<string>();
  /** Optional i18n key for the lead paragraph. */
  readonly leadKey = input<string | null>(null);
  /** Extra Tailwind classes, e.g. an alternating background. */
  readonly sectionClass = input<string>('');
}
