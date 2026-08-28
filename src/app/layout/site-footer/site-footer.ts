import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="relative bg-brand-600 text-white">
      <img
        aria-hidden="true"
        class="vx-footer-dots pointer-events-none absolute bottom-0 right-0 z-0 select-none"
        src="assets/vectores/topcircles.png"
        alt=""
      />

      <div
        class="vx-container relative z-1 flex flex-wrap items-center gap-x-8 gap-y-4 py-6
               pr-0 sm:pr-40"
      >
        <img class="h-7 w-auto" src="assets/brand/vixeran-logo.png" alt="VIXERAN®" />

        <div class="flex gap-6">
        <p class="text-sm">
          <span class="font-semibold">{{ 'footer.tagline' | translate }}</span>
          <span class="ml-2">{{ 'footer.taglineSecondary' | translate }}</span>
        </p>

        <nav class="ml-auto" [attr.aria-label]="'footer.legalLabel' | translate">
          <ul class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
            @for (link of legalLinks; track link.slug) {
              <li>
                <a class="hover:underline" [routerLink]="['/legal', link.slug]">
                  {{ link.labelKey | translate }}
                </a>
              </li>
            }
            <li class="text-[11px] text-white/70">
              {{ 'footer.copyright' | translate: { year: year } }}
            </li>
          </ul>
        </nav>
        </div>
       

        <img
          class="hidden h-10 w-auto sm:absolute sm:right-10 sm:top-1/2 sm:block sm:-translate-y-1/2"
          src="assets/brand/syngenta-biologicals.png"
          alt="Syngenta Biologicals"
        />
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();

  protected readonly legalLinks = [
    { slug: 'legal-notice', labelKey: 'footer.legalNotice' },
    { slug: 'privacy-policy', labelKey: 'footer.privacyPolicy' },
    { slug: 'cookie-policy', labelKey: 'footer.cookiePolicy' },
    { slug: 'terms-of-use', labelKey: 'footer.termsOfUse' },
  ] as const;
}
