import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FoundationCard } from '../foundation-card';

/** 04 / card 4 — More potential in spring. */
@Component({
  selector: 'app-spring-card',
  imports: [FoundationCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-foundation-card
      icon="assets/all/slide-04/icon-04.svg"
      titleKey="foundations.pillars.spring.title"
      bodyKey="foundations.pillars.spring.body"
      backKey="foundations.pillars.spring.back"
    />
  `,
})
export class SpringCard {}
