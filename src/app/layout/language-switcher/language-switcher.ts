import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="flex items-center gap-2 text-xs">
      <span class="sr-only">Language</span>
      <select
        class="cursor-pointer rounded-sm border border-sand-300 bg-white px-2 py-1 text-xs
               font-semibold uppercase tracking-wider text-brand-900"
        [value]="language.current()"
        (change)="onChange($event)"
      >
        @for (lang of language.languages; track lang.code) {
          <option [value]="lang.code">{{ lang.code.toUpperCase() }} — {{ lang.label }}</option>
        }
      </select>
    </label>
  `,
})
export class LanguageSwitcher {
  protected readonly language = inject(LanguageService);

  protected onChange(event: Event): void {
    this.language.use((event.target as HTMLSelectElement).value);
  }
}
