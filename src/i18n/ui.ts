import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsgrundsätze', contactLabel: 'Kontakt', reviewedBy: 'Erstellt von',
  skipToContent: 'Zum Inhalt springen', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Brotkrumen', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Häufige Fragen', relatedCalculators: 'Weiter mit', sourcesTitle: 'Amtliche Quellen dieser Seite', writtenBy: 'Erstellt von',
  asOf: 'Stand', lastUpdated: 'Ladenöffnungsgesetze der 16 Länder geprüft am', footerValidated: 'Quellen: Ladenöffnungsgesetze der 16 Länder, Verordnungen, Allgemeinverfügungen und Amtsblätter der Städte',
  footerBrowser: 'Alles läuft in Ihrem Browser · nichts, was Sie eingeben, wird gesendet oder gespeichert · kein Konto',
  footerDisclaimer: 'Unabhängige Seite von Radif Partners, ohne Verbindung zu einer Stadt, einem Land, einer Behörde, einem Händlerverband oder einem Geschäft. Maßgeblich ist allein die Bekanntmachung Ihrer Stadt; kurzfristige Absagen durch Gerichte oder Räte sind möglich. Die Seite ersetzt keine Rechtsberatung.',
  footerPopular: 'Werkzeuge',
  notFound: 'Unter dieser Adresse gibt es keine Seite. Auf der Startseite finden Sie den Termin-Finder für verkaufsoffene Sonntage in allen 16 Ländern.',
  readMore: 'Weiterlesen',
  moreOptions: 'Weitere Angaben', copyLink: 'Link kopieren', copied: 'Link kopiert', print: 'Drucken', howComputed: 'So wird gerechnet', openFull: 'Zum vollständigen Werkzeug',
  countdownTo: 'Noch bis', days: 'Tage', hours: 'Std.', minutes: 'Min.', seconds: 'Sek.', tzNote: 'Rechnet mit der Uhr Ihres Geräts, Zeitzone', passed: 'Dieser Termin liegt hinter uns.',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'shop opening acts of all 16 states checked on', footerValidated: 'Sources: shop opening acts of the 16 states, municipal ordinances, general orders and official gazettes',
  footerBrowser: 'Everything runs in your browser · nothing you type is sent or stored · no account',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with any town, state, authority, retail association or shop. Only your town’s own notice is binding; courts or councils can cancel a date at short notice. This site does not replace legal advice.',
  footerPopular: 'Tools',
  notFound: 'Nothing lives at this address. The home page has the date finder for shopping Sundays in all 16 German states.',
  readMore: 'Read more',
  moreOptions: 'More details', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is calculated', openFull: 'Open the full tool',
  countdownTo: 'Time left until', days: 'days', hours: 'hrs', minutes: 'min', seconds: 'sec', tzNote: 'Uses your device clock, time zone', passed: 'This date has passed.',
};
const ALL = { de, en };
export function t(lang: Locale) { return ALL[lang] ?? de; }
