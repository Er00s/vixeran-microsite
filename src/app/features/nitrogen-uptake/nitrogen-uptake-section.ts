import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SectionShell } from '../../shared/components/section-shell';

/**
 * 06 - How VIXERAN® enhances crop nitrogen uptake.
 *
 * Copy sits on the left; the nodule / Bio Engineer still is the bg6 plate.
 */
@Component({
  selector: 'app-nitrogen-uptake-section',
  imports: [SectionShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section-shell
      anchor="nitrogen-uptake"
      number="06"
      eyebrowKey="nitrogenUptake.eyebrow"
      titleKey="nitrogenUptake.title"
      leadKey="nitrogenUptake.body"
      background="assets/img/bg6.png"
      backgroundPosition="right center"
      sectionClass="vx-slide-bg"
    ></app-section-shell>
  `,
})
export class NitrogenUptakeSection {}
