import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="flex items-center gap-2 text-xs">
      <span class="sr-only">Language</span>
      <select
        class="cursor-pointer rounded-full border border-white/40 bg-transparent px-3 py-1.5
               text-[11px] font-semibold uppercase tracking-wider text-white
               hover:bg-white/10"
        [value]="language.current()"
        (change)="onChange($event)"
      >
        @for (lang of language.languages; track lang.code) {
          <option class="bg-white text-ink-900" [value]="lang.code">
            {{ lang.code.toUpperCase() }}
          </option>
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
