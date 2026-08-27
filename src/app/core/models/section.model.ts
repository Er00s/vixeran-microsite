/**
 * The eight steps of the campaign journey, as laid out in the
 * "micrositio-v05" design.
 *
 * This array drives BOTH the header navigation and the order in which the
 * section components are rendered on the page, so the two can never drift.
 *
 * Heads-up on 02 and 03: in the design the green pill of a section does not
 * repeat its own headline. "02. KEY BENEFITS OF VIXERAN®" sits above the
 * "How VIXERAN® works" headline, and "03. MEET THE BIO ENGINEERS" sits above
 * "Key benefits of VIXERAN®". The header nav follows the pills. This is
 * reproduced verbatim from the comp and is pending confirmation with design —
 * it may well be a layer mix-up in the source PSD.
 */
export interface JourneySection {
  /** "01" ... "08" - printed inside the green section pill. */
  number: string;
  /** DOM id used as the scroll anchor. */
  anchor: string;
  /** i18n key for the pill label ("Lay the Foundations"). */
  titleKey: string;
  /** i18n key for the headline rendered inside the section. */
  subtitleKey: string;
  /** i18n key for the short label used in the header nav. */
  shortKey: string;
  /** Whether the section appears in the header nav - the hero does not. */
  inNav: boolean;
}

export const JOURNEY_SECTIONS: readonly JourneySection[] = [
  {
    number: '01',
    anchor: 'welcome',
    titleKey: 'nav.welcome.title',
    subtitleKey: 'nav.welcome.subtitle',
    shortKey: 'nav.welcome.short',
    inNav: false,
  },
  {
    number: '02',
    anchor: 'how-it-works',
    titleKey: 'nav.howItWorks.title',
    subtitleKey: 'nav.howItWorks.subtitle',
    shortKey: 'nav.howItWorks.short',
    inNav: false,
  },
  {
    number: '03',
    anchor: 'key-benefits',
    titleKey: 'nav.keyBenefits.title',
    subtitleKey: 'nav.keyBenefits.subtitle',
    shortKey: 'nav.keyBenefits.short',
    inNav: true,
  },
  {
    number: '04',
    anchor: 'foundations',
    titleKey: 'nav.foundations.title',
    subtitleKey: 'nav.foundations.subtitle',
    shortKey: 'nav.foundations.short',
    inNav: true,
  },
  {
    number: '05',
    anchor: 'trials',
    titleKey: 'nav.trials.title',
    subtitleKey: 'nav.trials.subtitle',
    shortKey: 'nav.trials.short',
    inNav: true,
  },
  {
    number: '06',
    anchor: 'nitrogen-uptake',
    titleKey: 'nav.nitrogenUptake.title',
    subtitleKey: 'nav.nitrogenUptake.subtitle',
    shortKey: 'nav.nitrogenUptake.short',
    inNav: true,
  },
  {
    number: '07',
    anchor: 'success',
    titleKey: 'nav.success.title',
    subtitleKey: 'nav.success.subtitle',
    shortKey: 'nav.success.short',
    inNav: true,
  },
  {
    number: '08',
    anchor: 'contact',
    titleKey: 'nav.contact.title',
    subtitleKey: 'nav.contact.subtitle',
    shortKey: 'nav.contact.short',
    inNav: true,
  },
] as const;

/** The header nav links (hero is excluded). */
export const NAV_SECTIONS: readonly JourneySection[] = JOURNEY_SECTIONS.filter(
  (section) => section.inNav,
);
