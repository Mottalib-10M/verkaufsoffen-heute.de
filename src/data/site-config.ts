/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://verkaufsoffen-heute.de";
export const SITE_NAMES: Record<string, string> = {"de": "Verkaufsoffen Heute", "en": "Verkaufsoffen Heute"};
// Partie du nom affichée en couleur dans l'en-tête (RECETTE §10.3), « » pour aucune.
export const BRAND_ACCENT = "Verkaufsoffen";
export const LANG_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-DE"};
export const NUM_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-GB"};
export const OG_LOCALES: Record<string, string> = {"de": "de_DE", "en": "en_GB"};
export const LOCALE_TAG = 'de-DE';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-29';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber eines unabhängigen Kalenders der verkaufsoffenen Sonntage, der jede Freigabe auf die Verordnung der Gemeinde zurückführt", "en": "Publisher of an independent calendar of German shopping Sundays that traces every date back to the town's own ordinance"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners liest die Ladenöffnungsgesetze der sechzehn Länder und die Verordnungen, Allgemeinverfügungen und Amtsblätter der Städte, trägt jeden freigegebenen Sonntag mit Anlass, Gebiet, Uhrzeit und Fundstelle ein und schreibt „noch nicht veröffentlicht“, solange eine Stadt nichts beschlossen hat. Wir werben für kein Geschäft und kein Einkaufszentrum.", "en": "Radif Partners reads the shop opening acts of the sixteen German states and the ordinances, general orders and official gazettes of the towns, records every approved Sunday with its occasion, area, hours and reference, and writes “not yet published” while a town has decided nothing. We promote no shop and no mall."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Ladenöffnungsgesetze der 16 Bundesländer", "Bayerisches Ladenschlussgesetz (seit 1. August 2025)", "Anlassbezug verkaufsoffener Sonntage", "Sonn- und Feiertagsschutz nach Art. 140 GG und Art. 139 WRV", "Kommunale Verordnungen zur Sonntagsöffnung"], "en": ["Shop opening acts of the 16 German states", "Bavarian Shop Closing Act (since 1 August 2025)", "The occasion requirement for Sunday trading", "Constitutional protection of Sundays (Art. 140 Basic Law, Art. 139 Weimar Constitution)", "Municipal Sunday trading ordinances"]};
export const CONTACT_EMAIL = "contact@verkaufsoffen-heute.de";
export const THEME_COLOR = '#9F1239';
export const LOGO_SYMBOL = 'VS';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-NVPN9VFXKB';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'z5cehp95ii';
export const INDEXNOW_KEY = '7911a2dd39640af0c7a1fa3966401ae9';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt-IdNr.",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city']; // legalForm vide à dessein, comme les autres sites du portefeuille

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
