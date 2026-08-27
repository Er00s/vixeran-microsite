import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FoundationCard } from '../foundation-card';

/** 04 / card 2 — Yield stability. */
@Component({
  selector: 'app-stability-card',
  imports: [FoundationCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-foundation-card
      icon="assets/all/slide-04/icon-02.svg"
      titleKey="foundations.pillars.biomass.title"
      bodyKey="foundations.pillars.biomass.body"
      backKey="foundations.pillars.biomass.back"
    />
  `,
})
export class StabilityCard {}
