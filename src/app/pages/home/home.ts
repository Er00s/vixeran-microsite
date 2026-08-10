import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BioEngineersSection } from '../../features/bio-engineers/bio-engineers-section';
import { ContactSection } from '../../features/contact/contact-section';
import { FoundationsSection } from '../../features/foundations/foundations-section';
import { SuccessSection } from '../../features/success/success-section';
import { TrialsSection } from '../../features/trials/trials-section';
import { WelcomeSection } from '../../features/welcome/welcome-section';
import { JourneyNav } from '../../layout/journey-nav/journey-nav';

/**
 * The microsite itself: the six journey steps in the order approved in the
 * structure proposal, with the numbered rail pinned to the left on wide screens.
 */
@Component({
  selector: 'app-home',
  imports: [
    JourneyNav,
    WelcomeSection,
    FoundationsSection,
    BioEngineersSection,
    TrialsSection,
    SuccessSection,
    ContactSection,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-welcome-section />

    <div class="vx-container flex gap-8">
      <app-journey-nav />

      <div class="min-w-0 grow">
        <app-foundations-section />
        <app-bio-engineers-section />
        <app-trials-section />
        <app-success-section />
        <app-contact-section />
      </div>
    </div>
  `,
})
export class HomePage {}
