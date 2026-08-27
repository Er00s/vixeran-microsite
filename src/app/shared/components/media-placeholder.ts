import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Stand-in for campaign artwork that has not been delivered yet.
 *
 * Every slot that expects a Key Visual, illustration or photograph renders
 * one of these, labelled with what belongs there. Swap for a real <img> /
 * <picture> when the designer exports land.
 */
@Component({
  selector: 'app-media-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex h-full min-h-40 w-full flex-col items-center justify-center gap-1 rounded-2xl
             border border-dashed border-white/25 bg-white/5 p-6 text-center"
      [style.aspect-ratio]="ratio()"
      role="img"
      [attr.aria-label]="label()"
    >
      <span class="text-xs font-semibold uppercase tracking-widest text-mist-300">
        {{ label() }}
      </span>
      @if (hint()) {
        <span class="max-w-xs text-[11px] leading-snug text-mist-500">{{ hint() }}</span>
      }
    </div>
  `,
})
export class MediaPlaceholder {
  readonly label = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly ratio = input<string>('16 / 9');
}
