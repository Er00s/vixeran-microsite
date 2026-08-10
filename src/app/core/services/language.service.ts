import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface AppLanguage {
  /** BCP-47 code used for the JSON file name and the <html lang> attribute. */
  code: string;
  /** Name shown in the switcher, always in its own language. */
  label: string;
}

/**
 * Languages shipped with the microsite.
 *
 * Adding a market is a two-step job:
 *   1. drop `src/assets/i18n/<code>.json` (copy of en.json, translated),
 *   2. add the entry here.
 * No component changes, no rebuild of the routing.
 */
export const APP_LANGUAGES: readonly AppLanguage[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'pl', label: 'Polski' },
  { code: 'es', label: 'Español' },
] as const;

export const DEFAULT_LANGUAGE = 'en';

const STORAGE_KEY = 'vixeran.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly languages = APP_LANGUAGES;

  private readonly currentState = signal<string>(DEFAULT_LANGUAGE);
  readonly current = this.currentState.asReadonly();

  /** Called once from an APP_INITIALIZER in app.config.ts. */
  init(): void {
    this.translate.addLangs(APP_LANGUAGES.map((l) => l.code));
    this.translate.setFallbackLang(DEFAULT_LANGUAGE);
    this.use(this.detect());
  }

  use(code: string): void {
    const lang = APP_LANGUAGES.some((l) => l.code === code) ? code : DEFAULT_LANGUAGE;
    this.translate.use(lang);
    this.currentState.set(lang);
    this.document.documentElement.lang = lang;
    this.persist(lang);
  }

  /** ?lang= query param wins, then localStorage, then the browser, then EN. */
  private detect(): string {
    const fromQuery = new URLSearchParams(this.document.location.search).get('lang');
    if (fromQuery && this.isSupported(fromQuery)) {
      return fromQuery;
    }

    const stored = this.read();
    if (stored && this.isSupported(stored)) {
      return stored;
    }

    const browser = (this.translate.getBrowserLang() ?? '').toLowerCase();
    return this.isSupported(browser) ? browser : DEFAULT_LANGUAGE;
  }

  private isSupported(code: string): boolean {
    return APP_LANGUAGES.some((l) => l.code === code);
  }

  private read(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private persist(code: string): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* private browsing / cookies blocked - language just won't stick */
    }
  }
}
