import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FoundationCard } from '../foundation-card';

/** 04 / card 1 — Robust establishment. */
@Component({
  selector: 'app-establishment-card',
  imports: [FoundationCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-foundation-card
      icon="assets/all/slide-04/icon-01.svg"
      [tallGlyph]="true"
      titleKey="foundations.pillars.roots.title"
      bodyKey="foundations.pillars.roots.body"
      backKey="foundations.pillars.roots.back"
    />
  `,
})
export class EstablishmentCard {}
