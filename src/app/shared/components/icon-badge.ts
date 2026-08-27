import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Green circular badge used on glass cards. Until icon exports land, the
 * `label` (a short glyph such as "N") is rendered as text.
 */
@Component({
  selector: 'app-icon-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="flex size-12 shrink-0 items-center justify-center overflow-clip rounded-full
             bg-brand-500 text-sm font-semibold text-white"
      aria-hidden="true"
    >
      {{ label() }}
    </span>
  `,
})
export class IconBadge {
  readonly label = input.required<string>();
}
