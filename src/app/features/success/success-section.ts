import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiTestimonial } from '../../core/models/testimonial.model';
import { LanguageService } from '../../core/services/language.service';

interface DisplayTestimonial {
  id: number | string;
  photo: string;
  objectPosition: string;
  /** Present when loaded from API (rendered as plain text). */
  quote?: string;
  role?: string;
  origin?: string;
  photoAlt?: string;
  /** Present in static/i18n mode. */
  quoteKey?: string;
  roleKey?: string;
  originKey?: string;
  photoAltKey?: string;
}

const STATIC_CARDS: readonly DisplayTestimonial[] = [
  {
    id: 'grower',
    quoteKey: 'success.testimonials.grower.quote',
    roleKey: 'success.testimonials.grower.role',
    originKey: 'success.testimonials.grower.origin',
    photo: 'assets/all/slide-07/grower.webp',
    photoAltKey: 'success.testimonials.grower.photoAlt',
    objectPosition: '50% 18%',
  },
  {
    id: 'expert',
    quoteKey: 'success.testimonials.expert.quote',
    roleKey: 'success.testimonials.expert.role',
    originKey: 'success.testimonials.expert.origin',
    photo: 'assets/all/slide-07/syngenta.jpg',
    photoAltKey: 'success.testimonials.expert.photoAlt',
    objectPosition: '50% 12%',
  },
];

/**
 * 07 - Building success across Europe / Grower & Expert Experiences.
 *
 * Local/dev: static cards + i18n keys.
 * Production with API: published testimonials from Hostinger.
 */
@Component({
  selector: 'app-success-section',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="success"
      class="vx-slide relative"
    >
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
          @for (t of testimonials(); track t.id) {
            <li class="vx-success-card">
              <div class="vx-success-card-inner">
                <div class="vx-success-photo">
                  <img
                    [src]="t.photo"
                    [attr.alt]="t.photoAlt ?? (t.photoAltKey | translate)"
                    [style.object-position]="t.objectPosition"
                    loading="lazy"
                  />
                </div>

                <div class="vx-success-card-copy">
                  <h3>{{ t.role ?? (t.roleKey | translate) }}</h3>
                  <p class="vx-success-origin">{{ t.origin ?? (t.originKey | translate) }}</p>
                  <blockquote>{{ t.quote ?? (t.quoteKey | translate) }}</blockquote>
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
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);

  private readonly apiItems = toSignal(
    toObservable(this.language.current).pipe(
      switchMap((lang) => {
        if (!environment.apiBaseUrl) {
          return of(null);
        }
        return this.http
          .get<ApiTestimonial[]>(`${environment.apiBaseUrl}/testimonials`, {
            params: { lang },
          })
          .pipe(catchError(() => of([] as ApiTestimonial[])));
      }),
    ),
    { initialValue: null as ApiTestimonial[] | null },
  );

  protected readonly testimonials = computed<readonly DisplayTestimonial[]>(() => {
    const api = this.apiItems();
    if (!environment.apiBaseUrl || api === null) {
      return STATIC_CARDS;
    }
    if (api.length === 0) {
      return STATIC_CARDS;
    }
    return api.map((t) => ({
      id: t.id,
      photo: t.photo || 'assets/all/slide-07/grower.webp',
      objectPosition: t.objectPosition || '50% 50%',
      quote: t.quote,
      role: t.role,
      origin: t.origin,
      photoAlt: t.photoAlt,
    }));
  });
}
