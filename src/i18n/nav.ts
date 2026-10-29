import { route, hasRoute, type Locale } from './routes';
import { GUIDES, guideById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  de: { home: 'Termin-Finder', method: 'Methode', about: 'Über uns', widget: 'Finder einbinden', contact: 'Kontakt', editorial: 'Redaktionsgrundsätze', privacy: 'Datenschutz', terms: 'Impressum', cookies: 'Cookies' },
  en: { home: 'Date finder', method: 'Method', about: 'About', widget: 'Embed the finder', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
/** `short` : intitulé du menu du haut (un ou deux mots, RECETTE §10.3) ; `label` : intitulé complet. */
export const GROUPS: Array<{ id: Group; label: Record<Locale, string>; short: Record<Locale, string> }> = [
  { id: 'termine', label: { de: 'Termine und Kalender', en: 'Dates and calendars' }, short: { de: 'Termine', en: 'Dates' } },
  { id: 'staedte', label: { de: 'Verkaufsoffene Sonntage nach Stadt', en: 'Shopping Sundays by town' }, short: { de: 'Städte', en: 'Towns' } },
  { id: 'laender', label: { de: 'Verkaufsoffene Sonntage nach Bundesland', en: 'Shopping Sundays by state' }, short: { de: 'Länder', en: 'States' } },
  { id: 'regeln', label: { de: 'Gesetze und Regeln', en: 'Laws and rules' }, short: { de: 'Regeln', en: 'Rules' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? guideById(id)?.[lang]?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale, short = true): NavCategory[] {
  return GROUPS.map((g) => ({ label: (short ? g.short : g.label)[lang], links: g.id === 'termine' ? [link('home', lang), ...inGroup(g.id, lang)] : inGroup(g.id, lang) })).filter((c) => c.links.length);
}
/** La Méthode n'est pas dans le menu du haut (RECETTE §10.3) : sous le titre et en bas de page. */
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => {
  const site = { label: { de: 'Diese Seite', en: 'This site' }[lang], links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) };
  return [
    { label: GROUPS[0].label[lang], links: [...inGroup('termine', lang), ...inGroup('regeln', lang)] },
    { label: GROUPS[2].label[lang], links: inGroup('laender', lang) },
    { label: GROUPS[1].label[lang], links: inGroup('staedte', lang) },
    site,
  ];
};
/** Les outils, à un clic de toute page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => [link('home', lang), ...inGroup('termine', lang)];
