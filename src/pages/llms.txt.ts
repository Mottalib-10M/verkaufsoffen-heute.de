/** llms.txt (RECETTE §21), généré à partir du registre des pages. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const n = K.STAEDTE.length, t = K.alleTermine().length, by = K.REGELN.BY, be = K.REGELN.BE, nwr = K.REGELN.NW;
  const lines = [
    `# ${SITE_NAMES.de}`, '',
    `> Verkaufsoffene Sonntage (Sunday shop openings) in Germany for 2026 and 2027, in German and English. The rules come from the shop opening acts of all 16 states, read in the official state law portals on ${K.P.retrieved_at}: maximum Sundays per year (Baden-Württemberg 3, Bavaria ${by.max} under the new Bavarian Shop Closing Act in force since 1 August 2025, North Rhine-Westphalia ${nwr.max}, Berlin ${be.max}), the barred days (Easter Sunday, Whit Sunday, Volkstrauertag, Totensonntag, Advent rules by state) and the permitted hours. Each date for a town comes from that town's own ordinance, general order, gazette or official page, with its link and reading date: ${n} towns, ${t} dates. A town without an official notice is shown as "not yet published"; nothing is copied from aggregators. The finder uses the visitor's own date and builds an .ics calendar file in the browser; nothing entered is sent. Independent site by Radif Partners; no shop, mall or retail association is promoted. Last updated ${LAST_UPDATED}.`, '',
    `## Finder`, `- [Verkaufsoffener Sonntag: Termin-Finder](${SITE_URL}${route('home', 'de')})`, `- [Shopping Sundays: date finder](${SITE_URL}${route('home', 'en')})`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.de}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.de.nav}](${SITE_URL}${route(p.id, 'de')}): ${p.de.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Methode](${SITE_URL}${route('method', 'de')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Über uns](${SITE_URL}${route('about', 'de')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
