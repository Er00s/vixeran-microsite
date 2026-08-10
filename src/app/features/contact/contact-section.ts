import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { TrialsService } from '../../core/services/trials.service';
import { MediaPlaceholder } from '../../shared/components/media-placeholder';
import { SectionShell } from '../../shared/components/section-shell';

/**
 * 06 - Ready to Build Yours? / Contact Your Local Syngenta Representative.
 *
 * PHASE 1: the country selector reveals the representative details that ship
 * in `assets/data/countries.json`; the form does not POST anywhere yet.
 * PHASE 2: point `submit()` at the backend endpoint / Syngenta lead-capture.
 */
@Component({
  selector: 'app-contact-section',
  imports: [FormsModule, TranslatePipe, SectionShell, MediaPlaceholder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="contact"
      number="06"
      eyebrowKey="contact.eyebrow"
      titleKey="contact.title"
      leadKey="contact.lead"
      sectionClass="bg-sand-100"
    >
      <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
        <form class="flex max-w-md flex-col gap-4" (ngSubmit)="submit()">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-soil-700">
              {{ 'contact.form.country' | translate }}
            </span>
            <select
              name="country"
              class="rounded-sm border border-sand-300 bg-white px-3 py-2.5 text-sm"
              [ngModel]="selectedCountry()"
              (ngModelChange)="selectedCountry.set($event)"
              required
            >
              <option value="">{{ 'contact.form.countryPlaceholder' | translate }}</option>
              @for (country of countries(); track country) {
                <option [value]="country">{{ country }}</option>
              }
            </select>
          </label>

          <button type="submit" class="vx-btn-primary self-start" [disabled]="!selectedCountry()">
            {{ 'contact.form.submit' | translate }}
          </button>

          @if (submitted() && selectedCountry()) {
            <p class="vx-card text-sm text-soil-700" role="status">
              {{ 'contact.form.result' | translate: { country: selectedCountry() } }}
            </p>
          }

          <p class="text-[11px] leading-snug text-soil-700/70">
            {{ 'contact.form.disclaimer' | translate }}
          </p>
        </form>

        <app-media-placeholder
          label="Closing Key Visual + QR"
          hint="Sunset field, wooden sign with QR to the local representative finder"
          ratio="4 / 3"
        />
      </div>
    </app-section-shell>
  `,
})
export class ContactSection {
  private readonly trialsService = inject(TrialsService);

  protected readonly selectedCountry = signal<string>('');
  protected readonly submitted = signal(false);

  /**
   * Phase 1 reuses the trial countries as the selector options. Replace with
   * the full Syngenta market list (`assets/data/countries.json`) as soon as
   * Marketing provides the representative contact per market.
   */
  protected readonly countries = computed(() => this.trialsService.countries());

  protected submit(): void {
    this.submitted.set(true);
  }
}
