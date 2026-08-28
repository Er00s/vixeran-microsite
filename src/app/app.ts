import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteFooter } from './layout/site-footer/site-footer';
import { SiteHeader } from './layout/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#welcome"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
             focus:rounded-sm focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to content
    </a>

    <div class="vx-chrome">
      <app-site-header />
    </div>

    <div class="vx-scaler">
      <div class="vx-canvas">
        <main id="main">
          <router-outlet />
        </main>

        <app-site-footer />
      </div>
    </div>
  `,
})
export class App {}
