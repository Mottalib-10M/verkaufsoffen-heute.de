/** Blocs calculés partagés par plusieurs pages (tableaux : hors contrôle d'unicité). */
import type { Helpers } from './page-types';
import { LAENDER, LAND_NAME, type Land } from './engine/feiertage';
import { REGELN, jahresbild, kirchentage, pruefe } from './engine/regeln';
import { STAEDTE, staedteIn, stadtName, status, alleTermine, imJahr, type Stadt } from './staedte';
import { dShort, stunden, sperrText } from './tool-specs';

const T = (h: Helpers, de: string, en: string) => (h.lang === 'de' ? de : en);
const quelle = (h: Helpers, s: Stadt, i: number) => h.ext(s.quellen[i].url, s.quellen[i].herausgeber);

/** Les 16 lois côte à côte. */
export function tabelleGesetze(h: Helpers, y = 2027) {
  const rows = LAENDER.map((l) => { const r = REGELN[l]; return [h.a(`land-${l.toLowerCase()}`, LAND_NAME[l][h.lang]), r.max, stunden(l, h.lang), jahresbild(l, y).moeglich.length, h.src(r.quelle, `${r.gesetz} ${r.para}`)]; });
  return h.table([T(h, 'Land', 'State'), T(h, 'Höchstzahl', 'Maximum'), T(h, 'Uhrzeit', 'Hours'), T(h, `Mögliche Sonntage ${y}`, `Possible Sundays ${y}`), T(h, 'Gesetz', 'Act')], rows, T(h, `Verkaufsoffene Sonntage nach Landesrecht: Höchstzahl je Gemeinde und Jahr, erlaubte Stunden und die Sonntage ${y}, die das Gesetz nicht sperrt (gelesen am 29. Oktober 2026)`, `Shopping Sundays under state law: maximum per town and year, permitted hours and the Sundays of ${y} the act does not bar (read on 29 October 2026)`), ['l', 'r', 'l', 'r', 'l']);
}
/** Termine des villes d'un Land pour une année. */
export function tabelleLandTermine(h: Helpers, land: Land, y: number) {
  const list = imJahr(alleTermine(land), y);
  if (!list.length) return `<p>${T(h, `Für ${y} ist in unserer Liste noch keine Stadt in ${LAND_NAME[land].de} mit amtlich bekannt gemachten Terminen.`, `For ${y} our list has no town in ${LAND_NAME[land].en} with officially published dates yet.`)}</p>`;
  return h.table([T(h, 'Datum', 'Date'), T(h, 'Stadt', 'Town'), T(h, 'Gebiet', 'Area'), T(h, 'Anlass', 'Occasion'), T(h, 'Quelle', 'Source')], list.map((t) => [dShort(t.datum, h.lang), stadtName(t.stadt, h.lang), t.bereich ?? '–', t.anlass ?? '–', quelle(h, t.stadt, t.quelle)]), T(h, `Verkaufsoffene Sonn- und Feiertage ${y} in ${LAND_NAME[land].de}, wie von den Städten bekannt gemacht`, `Shopping Sundays and holidays ${y} in ${LAND_NAME[land].en}, as published by the towns`));
}
/** Stand des villes d'un Land. */
export function tabelleLandStaedte(h: Helpers, land: Land) {
  const list = staedteIn(land);
  if (!list.length) return '';
  const st = (s: Stadt, y: number) => { const n = s.termine.filter((t) => t.datum.startsWith(String(y))).length; const x = status(s, y); return x === 'veroeffentlicht' ? String(n) : x === 'nicht-gefunden' ? T(h, 'keine Quelle', 'no source') : T(h, 'offen', 'pending'); };
  return h.table([T(h, 'Stadt', 'Town'), '2026', '2027', T(h, 'Quelle', 'Source')], list.map((s) => [stadtName(s, h.lang), st(s, 2026), st(s, 2027), s.quellen[0] ? quelle(h, s, 0) : '–']), T(h, `Städte in ${LAND_NAME[land].de}: Zahl der Termine je Jahr („offen“ = noch nicht veröffentlicht)`, `Towns in ${LAND_NAME[land].en}: dates per year (“pending” = not yet published)`), ['l', 'r', 'r', 'l']);
}
/** Dimanches bloqués d'un Land pour une année, avec le motif. */
export function tabelleGesperrt(h: Helpers, land: Land, y: number) {
  const g = jahresbild(land, y).gesperrt;
  return h.table([T(h, 'Sonntag', 'Sunday'), T(h, 'Gesperrt als', 'Barred as')], g.map((p) => [dShort(p.iso, h.lang), p.gruende.map((x) => sperrText(x, h.lang)).join(', ')]), T(h, `${LAND_NAME[land].de} ${y}: Sonntage, die keine Stadt freigeben darf`, `${LAND_NAME[land].en} ${y}: Sundays no town may release`));
}
/** Les quatre dimanches de l'Avent dans les 16 Länder. */
export function tabelleAdvent(h: Helpers, y: number) {
  const k = kirchentage(y);
  const rows = LAENDER.map((l) => [LAND_NAME[l][h.lang], ...k.advent.map((d) => { const p = pruefe(l, d); return p.moeglich ? (p.hinweis ? T(h, 'ja, eingeschränkt', 'yes, limited') : T(h, 'ja', 'yes')) : T(h, 'nein', 'no'); })]);
  return h.table([T(h, 'Land', 'State'), ...k.advent.map((d, i) => `${i + 1}. Advent<br>${dShort(d, h.lang)}`)], rows, T(h, `Darf der Adventssonntag ${y} freigegeben werden? Nach den 16 Ladenöffnungsgesetzen`, `Can the Advent Sunday ${y} be released? Under the 16 shop opening acts`));
}
/** Index des villes : nombre de dates par année et lien de la page si elle existe. */
export function tabelleStaedte(h: Helpers, seiten: string[]) {
  const rows = STAEDTE.map((s) => { const id = `stadt-${s.id}`; const name = seiten.includes(id) ? h.a(id, stadtName(s, h.lang)) : stadtName(s, h.lang); const n = (y: number) => { const x = status(s, y); return x === 'veroeffentlicht' ? String(s.termine.filter((t) => t.datum.startsWith(String(y))).length) : x === 'nicht-gefunden' ? T(h, 'keine Quelle', 'no source') : T(h, 'offen', 'pending'); }; return [name, LAND_NAME[s.land][h.lang], n(2026), n(2027)]; });
  return h.table([T(h, 'Stadt', 'Town'), T(h, 'Land', 'State'), '2026', '2027'], rows, T(h, 'Alle Städte unserer Liste mit der Zahl der amtlich bekannt gemachten Termine', 'Every town on our list with the number of officially published dates'), ['l', 'l', 'r', 'r']);
}
/** Termine d'une ville pour une année, ou la mention « noch nicht veröffentlicht ». */
export function tabelleStadt(h: Helpers, s: Stadt, y: number) {
  const list = s.termine.filter((t) => t.datum.startsWith(String(y)));
  if (!list.length) return `<p>${status(s, y) === 'nicht-gefunden' ? T(h, `${s.name} ${y}: Wir haben keine amtliche Bekanntmachung gefunden.`, `${stadtName(s, 'en')} ${y}: we found no official notice.`) : T(h, `${s.name} ${y}: noch nicht veröffentlicht. Sobald die Stadt ihre Termine bekannt macht, stehen sie hier.`, `${stadtName(s, 'en')} ${y}: not yet published. As soon as the town announces its dates, they will appear here.`)}</p>`;
  return h.table([T(h, 'Datum', 'Date'), T(h, 'Gebiet', 'Area'), T(h, 'Anlass', 'Occasion'), T(h, 'Uhrzeit', 'Hours'), T(h, 'Quelle', 'Source')], list.map((t) => [dShort(t.datum, h.lang), t.bereich ?? '–', t.anlass ?? '–', t.zeit ?? '–', quelle(h, s, t.quelle)]), T(h, `Verkaufsoffene Sonn- und Feiertage ${y} in ${s.name}, wie von der Stadt bekannt gemacht`, `Shopping Sundays and holidays ${y} in ${stadtName(s, 'en')}, as published by the town`));
}
