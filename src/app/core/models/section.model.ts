/**
 * The six steps of the campaign journey, as approved in the
 * "VIXERAN Autumn Campaign Microsite - Experience & Structure Proposal".
 *
 * This array drives BOTH the numbered side navigation and the order in which
 * the section components are rendered on the page, so the two can never drift.
 */
export interface JourneySection {
  /** "01" ... "06" - printed in the side nav. */
  number: string;
  /** DOM id used as the scroll anchor. */
  anchor: string;
  /** i18n key for the campaign experience title ("Welcome to the Building Site"). */
  titleKey: string;
  /** i18n key for the content focus subtitle ("Autumn is Building Season"). */
  subtitleKey: string;
  /** i18n key for the short label used in the top bar ("Field trials"). */
  shortKey: string;
}

export const JOURNEY_SECTIONS: readonly JourneySection[] = [
  {
    number: '01',
    anchor: 'welcome',
    titleKey: 'nav.welcome.title',
    subtitleKey: 'nav.welcome.subtitle',
    shortKey: 'nav.welcome.short',
  },
  {
    number: '02',
    anchor: 'foundations',
    titleKey: 'nav.foundations.title',
    subtitleKey: 'nav.foundations.subtitle',
    shortKey: 'nav.foundations.short',
  },
  {
    number: '03',
    anchor: 'bio-engineers',
    titleKey: 'nav.bioEngineers.title',
    subtitleKey: 'nav.bioEngineers.subtitle',
    shortKey: 'nav.bioEngineers.short',
  },
  {
    number: '04',
    anchor: 'trials',
    titleKey: 'nav.trials.title',
    subtitleKey: 'nav.trials.subtitle',
    shortKey: 'nav.trials.short',
  },
  {
    number: '05',
    anchor: 'success',
    titleKey: 'nav.success.title',
    subtitleKey: 'nav.success.subtitle',
    shortKey: 'nav.success.short',
  },
  {
    number: '06',
    anchor: 'contact',
    titleKey: 'nav.contact.title',
    subtitleKey: 'nav.contact.subtitle',
    shortKey: 'nav.contact.short',
  },
] as const;
