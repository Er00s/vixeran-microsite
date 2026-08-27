import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { SectionShell } from '../../shared/components/section-shell';
import { TrialMap } from './trial-map/trial-map';

/** 05 - Explore the Construction Sites / interactive trial map. */
@Component({
  selector: 'app-trials-section',
  imports: [TranslatePipe, SectionShell, TrialMap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="trials"
      number="05"
      eyebrowKey="trials.eyebrow"
      titleKey="trials.title"
      background="assets/img/bg5.png"
      sectionClass="vx-slide-bg"
    >
      <app-trial-map />
 
    </app-section-shell>
  `,
})
export class TrialsSection {}
