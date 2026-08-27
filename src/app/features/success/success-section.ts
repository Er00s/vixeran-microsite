import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface Testimonial {
  quoteKey: string;
  roleKey: string;
  originKey: string;
  photo: string;
  photoAltKey: string;
  objectPosition: string;
}

/**
 * 07 - Building success across Europe / Grower & Expert Experiences.
 *
 * Full-bleed rapeseed plate with copy at the top left and two glass
 * portrait cards along the lower band. The white frame is a CSS border on
 * the card — not the stretched slide-07/card-frame.svg overlay.
 */
@Component({
  selector: 'app-success-section',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="success"
      class="vx-slide relative overflow-hidden"
    >
      <img
        src="assets/all/slide-07/fondo.webp"
        class="absolute inset-0 size-full object-cover object-center"
        loading="lazy"
        [attr.alt]="'success.visualLabel' | translate"
      />

      <div
        class="vx-success-stage relative z-[2] mx-auto flex h-full min-h-svh
               w-full max-w-[1920px] flex-col justify-between gap-10 px-5 pb-16
               md:px-10 md:pb-20"
      >
        <div class="vx-success-copy max-w-3xl">
          <p class="vx-eyebrow">07. {{ 'success.eyebrow' | translate }}</p>

          <h2
            class="vx-success-title mt-5 text-3xl font-semibold leading-[1.1] text-white
                   md:text-5xl md:leading-[1.1]"
          >
            {{ 'success.title' | translate }}
          </h2>

          <p
            class="vx-success-lead mt-4 max-w-2xl text-base font-medium leading-snug text-white
                   md:text-lg"
          >
            {{ 'success.lead' | translate }}
          </p>
        </div>

        <ul class="vx-success-grid grid w-full gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
          @for (t of testimonials; track t.quoteKey) {
            <li class="vx-success-card">
              <div class="vx-success-card-inner">
                <div class="vx-success-photo">
                  <img
                    [src]="t.photo"
                    [attr.alt]="t.photoAltKey | translate"
                    [style.object-position]="t.objectPosition"
                    loading="lazy"
                  />
                </div>

                <div class="vx-success-card-copy">
                  <h3>{{ t.roleKey | translate }}</h3>
                  <p class="vx-success-origin">{{ t.originKey | translate }}</p>
                  <blockquote>{{ t.quoteKey | translate }}</blockquote>
                </div>
              </div>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class SuccessSection {
  protected readonly testimonials: readonly Testimonial[] = [
    {
      quoteKey: 'success.testimonials.grower.quote',
      roleKey: 'success.testimonials.grower.role',
      originKey: 'success.testimonials.grower.origin',
      photo: 'assets/all/slide-07/grower.webp',
      photoAltKey: 'success.testimonials.grower.photoAlt',
      objectPosition: '50% 18%',
    },
    {
      quoteKey: 'success.testimonials.expert.quote',
      roleKey: 'success.testimonials.expert.role',
      originKey: 'success.testimonials.expert.origin',
      photo: 'assets/all/slide-07/syngenta.jpg',
      photoAltKey: 'success.testimonials.expert.photoAlt',
      objectPosition: '50% 12%',
    },
  ];
}
