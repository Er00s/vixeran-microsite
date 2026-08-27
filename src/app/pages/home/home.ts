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
    <app-how-it-works-section />
    <app-key-benefits-section />
    <app-foundations-section />
    <app-trials-section />
    <app-nitrogen-uptake-section />
    <app-success-section />
    <app-contact-section />
  `,
})
export class HomePage {}
