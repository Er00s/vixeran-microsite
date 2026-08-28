import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface BenefitCard {
  icon: string;
  iconClass: string;
  titleKey: string;
  bodyKey: string;
  body2Key?: string;
}

/**
 * 03 - Key benefits of VIXERAN®.
 *
 * Layout follows the 1920 campaign frame: copy on the dark soil at the left,
 * four tall notched cards on the right, artwork from slide-03.
 */
@Component({
  selector: 'app-key-benefits-section',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="key-benefits"
      class="vx-slide relative"
    >
      <div
        class="vx-benefits-stage relative z-2 mx-auto flex h-full min-h-svh
               w-full max-w-[1920px] gap-8 px-5 py-10
               md:px-10 md:py-12"
      >
        <div class="vx-benefits-header max-w-xl">
          <p class="vx-eyebrow">03. {{ 'keyBenefits.eyebrow' | translate }}</p>

          <h2
            class="vx-benefits-title mt-5 text-3xl font-semibold leading-[1.1] text-white
                   md:text-5xl md:leading-[1.1]"
          >
            {{ 'keyBenefits.titleLine1' | translate }}<br />
            {{ 'keyBenefits.titleBrand' | translate }}
          </h2>
        </div>

        <div class="vx-benefits-content flex flex-wrap w-full items-center gap-6">
          <p
            class="vx-benefits-lead max-w-2xl text-center text-[14px] font-medium leading-[1.6] text-white
                   md:text-[16px]"
          >
            {{ 'keyBenefits.lead' | translate }}
          </p>

          <ul class="vx-benefits-grid grid w-full grid-cols-2 justify-center gap-3 sm:gap-4">
            @for (card of cards; track card.titleKey) {
              <li class="vx-benefits-card relative w-full">
                <span class="vx-benefits-fill" aria-hidden="true"></span>

                <img
                  aria-hidden="true"
                  class="pointer-events-none absolute inset-0 size-full object-fill"
                  src="assets/img/slide-03/card-frame.svg"
                  alt=""
                />

                <span class="vx-benefits-icon" aria-hidden="true">
                  <img [src]="card.icon" [class]="card.iconClass" alt="" />
                </span>

                <div class="vx-benefits-copy-inner">
                  <h3>{{ card.titleKey | translate }}</h3>
                  <span class="vx-benefits-rule" aria-hidden="true"></span>
                  <p>{{ card.bodyKey | translate }}</p>
                  @if (card.body2Key) {
                    <p>{{ card.body2Key | translate }}</p>
                  }
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class KeyBenefitsSection {
  protected readonly cards: readonly BenefitCard[] = [
    {
      icon: 'assets/all/slide-03/icon-01.svg',
      iconClass: 'vx-benefits-glyph vx-benefits-glyph--n',
      titleKey: 'keyBenefits.cards.nitrogen.title',
      bodyKey: 'keyBenefits.cards.nitrogen.body',
      body2Key: 'keyBenefits.cards.nitrogen.body2',
    },
    {
      icon: 'assets/all/slide-03/icon-02.svg',
      iconClass: 'vx-benefits-glyph',
      titleKey: 'keyBenefits.cards.tested.title',
      bodyKey: 'keyBenefits.cards.tested.body',
      body2Key: 'keyBenefits.cards.tested.body2',
    },
    {
      icon: 'assets/all/slide-03/icon-03.svg',
      iconClass: 'vx-benefits-glyph',
      titleKey: 'keyBenefits.cards.apply.title',
      bodyKey: 'keyBenefits.cards.apply.body',
      body2Key: 'keyBenefits.cards.apply.body2',
    },
    {
      icon: 'assets/all/slide-03/icon-04.svg',
      iconClass: 'vx-benefits-glyph',
      titleKey: 'keyBenefits.cards.robust.title',
      bodyKey: 'keyBenefits.cards.robust.body',
    },
  ];
}
