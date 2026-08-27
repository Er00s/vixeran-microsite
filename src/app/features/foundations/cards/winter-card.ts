import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FoundationCard } from '../foundation-card';

/** 04 / card 3 — More resilience for winter. */
@Component({
  selector: 'app-winter-card',
  imports: [FoundationCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-foundation-card
      icon="assets/all/slide-04/icon-03.svg"
      titleKey="foundations.pillars.winter.title"
      bodyKey="foundations.pillars.winter.body"
      backKey="foundations.pillars.winter.back"
    />
  `,
})
export class WinterCard {}
