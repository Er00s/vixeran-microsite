import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Flip card for slide 04. The `cuadros.svg` filete (icon notch + flip pill)
 * sits over a masked glass fill. Tapping the green pill turns the framed
 * interior solid brand green and swaps the body copy.
 */
@Component({
  selector: 'app-foundation-card',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vx-found-shell relative block h-full w-full',
    '[class.is-flipped]': 'flipped()',
  },
  template: `
    <div class="vx-found-card__fill" aria-hidden="true">
      <span class="vx-found-card__frost"></span>
    </div>
    <div class="vx-found-card">
      <div class="vx-found-card__rotator">
        <div class="vx-found-card__face vx-found-card__face--front">
          <img
            class="vx-found-card__frame"
            src="assets/all/slide-04/cuadros.svg"
            alt=""
            aria-hidden="true"
          />
          <span class="vx-found-card__icon" aria-hidden="true">
            <img
              class="vx-found-card__glyph"
              [class.vx-found-card__glyph--tree]="tallGlyph()"
              [src]="icon()"
              alt=""
            />
          </span>
          <div class="vx-found-card__copy">
            <div class="vx-found-card__copy-inner">
              <h3>{{ titleKey() | translate }}</h3>
              <span class="vx-found-card__rule" aria-hidden="true"></span>
              <p>{{ bodyKey() | translate }}</p>
            </div>
          </div>
          <button
            type="button"
            class="vx-found-card__flip"
            [attr.aria-pressed]="flipped()"
            (click)="toggle()"
          >
            <span class="sr-only">{{ 'foundations.flip' | translate }}</span>
          </button>
        </div>

        <div class="vx-found-card__face vx-found-card__face--back">
          <div class="vx-found-card__fill vx-found-card__fill--solid" aria-hidden="true"></div>
          <img
            class="vx-found-card__frame"
            src="assets/all/slide-04/cuadros.svg"
            alt=""
            aria-hidden="true"
          />
          <span class="vx-found-card__icon" aria-hidden="true">
            <img
              class="vx-found-card__glyph"
              [class.vx-found-card__glyph--tree]="tallGlyph()"
              [src]="icon()"
              alt=""
            />
          </span>
          <div class="vx-found-card__copy">
            <div class="vx-found-card__copy-inner">
              @if (!flipped()) {
                <h3>{{ titleKey() | translate }}</h3>
                <span class="vx-found-card__rule" aria-hidden="true"></span>
              }
              <p>{{ backKey() | translate }}</p>
            </div>
          </div>
          <button
            type="button"
            class="vx-found-card__flip"
            [attr.aria-pressed]="flipped()"
            (click)="toggle()"
          >
            <span class="sr-only">{{ 'foundations.unflip' | translate }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class FoundationCard {
  readonly icon = input.required<string>();
  readonly tallGlyph = input(false);
  readonly titleKey = input.required<string>();
  readonly bodyKey = input.required<string>();
  readonly backKey = input.required<string>();

  protected readonly flipped = signal(false);

  protected toggle(): void {
    this.flipped.update((value) => !value);
  }
}
