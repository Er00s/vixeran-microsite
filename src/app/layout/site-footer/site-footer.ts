import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-brand-900 text-sand-100">
      <div
        class="vx-container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between"
      >
        <span class="font-display text-2xl font-bold tracking-tight">syngenta</span>

        <nav [attr.aria-label]="'footer.legalLabel' | translate">
          <ul class="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            @for (link of legalLinks; track link.slug) {
              <li>
                <a class="hover:underline" [routerLink]="['/legal', link.slug]">
                  {{ link.labelKey | translate }}
                </a>
              </li>
            }
          </ul>
        </nav>

        <p class="text-[11px] leading-relaxed text-sand-300 md:text-right">
          {{ 'footer.copyright' | translate: { year: year } }}<br />
          {{ 'footer.rights' | translate }}
        </p>
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
    { slug: 'sitemap', labelKey: 'footer.sitemap' },
    { slug: 'contact', labelKey: 'footer.contact' },
  ] as const;
}
