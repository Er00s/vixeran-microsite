import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Stand-in for campaign artwork that has not been delivered yet.
 *
 * Every slot in the storyboard that expects a Key Visual, an illustration or a
 * photograph renders one of these, labelled with what belongs there. Search the
 * codebase for `app-media-placeholder` to get the full asset shopping list.
 */
@Component({
  selector: 'app-media-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed
             border-sand-300 bg-sand-100 p-6 text-center"
      [style.aspect-ratio]="ratio()"
      role="img"
      [attr.aria-label]="label()"
    >
      <span class="font-display text-xs font-semibold uppercase tracking-widest text-soil-700">
        {{ label() }}
      </span>
      @if (hint()) {
        <span class="max-w-xs text-[11px] leading-snug text-soil-700/70">{{ hint() }}</span>
      }
    </div>
  `,
})
export class MediaPlaceholder {
  /** What asset goes here, e.g. "Hero Key Visual". */
  readonly label = input.required<string>();
  /** Optional spec note, e.g. "2400x1200, .webp". */
  readonly hint = input<string | null>(null);
  /** CSS aspect-ratio value. */
  readonly ratio = input<string>('16 / 9');
}
