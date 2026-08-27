import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Placeholder page for the footer legal documents.
 *
 * The actual copy is owned by Syngenta Legal and differs per market; when it
 * arrives, either drop it into the i18n files under `legal.<slug>.body` or
 * point these links straight at the corporate URLs.
 */
@Component({
  selector: 'app-legal',
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="vx-container vx-section max-w-3xl"
      style="padding-top: calc(var(--spacing-header) + 2rem)"
    >
      <a routerLink="/" class="text-xs uppercase tracking-widest text-brand-700 hover:underline">
        &larr; {{ 'legal.back' | translate }}
      </a>

      <h1 class="mt-4 text-4xl text-brand-900">{{ 'legal.' + slug() + '.title' | translate }}</h1>

      <p class="mt-6 rounded-md border border-dashed border-sand-300 bg-sand-100 p-6 text-sm text-soil-700">
        {{ 'legal.pending' | translate }}
      </p>
    </article>
  `,
})
export class LegalPage {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap);

  protected readonly slug = computed(() => this.params()?.get('document') ?? 'legal-notice');
}
