import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** A single KPI box: big number on top, translated caption below. */
@Component({
  selector: 'app-stat-tile',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-card flex flex-col gap-1">
      <span class="font-display text-3xl font-bold leading-none text-brand-700">
        {{ value() }}
      </span>
      <span class="text-xs font-semibold uppercase tracking-wider text-soil-700">
        {{ labelKey() | translate }}
      </span>
      @if (noteKey()) {
        <span class="text-[11px] leading-snug text-soil-700/80">{{ noteKey()! | translate }}</span>
      }
    </div>
  `,
})
export class StatTile {
  readonly value = input.required<string | number>();
  readonly labelKey = input.required<string>();
  readonly noteKey = input<string | null>(null);
}
