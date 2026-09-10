import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactSection } from '../../features/contact/contact-section';
import { FoundationsSection } from '../../features/foundations/foundations-section';
import { HowItWorksSection } from '../../features/how-it-works/how-it-works-section';
import { KeyBenefitsSection } from '../../features/key-benefits/key-benefits-section';
import { NitrogenUptakeSection } from '../../features/nitrogen-uptake/nitrogen-uptake-section';
import { SuccessSection } from '../../features/success/success-section';
import { TrialsSection } from '../../features/trials/trials-section';
import { WelcomeSection } from '../../features/welcome/welcome-section';

/**
 * Single-page journey, in the order of Micrositio-vixeran-FINAL.
 * Each section is full-bleed; section chrome lives inside SectionShell.
 */
@Component({
  selector: 'app-home',
  imports: [
    WelcomeSection,
    HowItWorksSection,
    KeyBenefitsSection,
    FoundationsSection,
    TrialsSection,
    NitrogenUptakeSection,
    SuccessSection,
    ContactSection,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-welcome-section />
    <div class="vx-flow-02-03 relative">
      <video
        class="pointer-events-none absolute inset-0 size-full object-cover object-top"
        src="assets/arrglo-planta.mp4"
        autoplay
        muted
        loop
        playsinline
        aria-hidden="true"
      ></video>
      <app-how-it-works-section />
      <app-key-benefits-section />
    </div>
    <app-foundations-section />
    <app-trials-section />
    <app-nitrogen-uptake-section />
    <div class="vx-flow-07-08 relative">
      <img
        src="assets/all/slide-07/bg-flow-07-08.png"
        class="pointer-events-none absolute inset-0 size-full object-cover object-center"
        loading="lazy"
        alt=""
        aria-hidden="true"
      />
      <app-success-section />
      <app-contact-section />
    </div>
  `,
})
export class HomePage {}
