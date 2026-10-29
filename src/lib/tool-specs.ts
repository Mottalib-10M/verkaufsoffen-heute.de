/**
 * Die deklarativen Werkzeuge der Seite (gerendert von components/calc/SpecTool.tsx, als Mini-Rechner von MiniSim.tsx).
 * Jede Regel kommt aus engine/regeln.ts (Landesgesetze), jeder Termin aus data/staedte.json (Verordnungen der Städte).
 * Der Termin-Finder mit dem Datum des Besuchers und dem .ics-Export ist eine eigene Komponente (components/vs/Finder.tsx).
 */
import type { ToolSpec, V, ToolOut, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatNumber, type Lang } from './format';
import { LAENDER, LAND_NAME, type Land } from './engine/feiertage';
import { REGELN, SPERRE_TEXT, pruefe, jahresbild, sonntage, kirchentage } from './engine/regeln';
import { STAEDTE, stadtById, staedteIn, stadtName, status } from './staedte';
import P from '../data/params-2026.json';

export type Args = Record<string, number | string>;
const T = (l: Lang, de: string, en: string) => (l === 'de' ? de : en);
const s = (v: V, k: string) => String(v[k] ?? '');
const num = (x: number, l: Lang) => formatNumber(x, 0, l);
const TAG = (l: Lang) => (l === 'de' ? 'de-DE' : 'en-GB');
const fmt = (iso: string, l: Lang, o: Intl.DateTimeFormatOptions) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(TAG(l), { ...o, timeZone: 'UTC' });
/** « 29. November 2026 » / « 29 November 2026 » */
export const dLong = (iso: string, l: Lang) => fmt(iso, l, { day: 'numeric', month: 'long', year: 'numeric' });
/** « Sonntag, 29. November 2026 » */
export const dWeek = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
/** « So., 29. November » / « Sun 29 November » */
export const dShort = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'short', day: 'numeric', month: 'long' });
export const uhr = (h: number | null, l: Lang) => (h === null ? '–' : T(l, `${h} Uhr`, `${h}:00`));
export const sperrText = (g: string, l: Lang) => SPERRE_TEXT[g as keyof typeof SPERRE_TEXT][l];

/* ------------------------------------------------------------------ Felder */
const JAHRE = (P as { jahre: number[] }).jahre;
const landOpts = (l: Lang): Opt[] => LAENDER.map((c) => ({ value: c, label: LAND_NAME[c][l] }));
const fLand = (l: Lang, def: string, id = 'land', label = T(l, 'Bundesland', 'State')) => ({ kind: 'select' as const, id, label, def, options: landOpts(l) });
const fJahr = (l: Lang, def: number) => ({ kind: 'select' as const, id: 'jahr', label: T(l, 'Jahr', 'Year'), def: String(def), options: JAHRE.map((y) => ({ value: String(y), label: String(y) })) });
const sonntagOpts = (l: Lang) => (v: V): Opt[] => sonntage(Number(s(v, 'jahr')) || 2026).map((d) => ({ value: d, label: dShort(d, l) }));
const stadtOpts = (l: Lang, land?: string): Opt[] => STAEDTE.filter((x) => !land || x.land === land).map((x) => ({ value: x.id, label: `${stadtName(x, l)} (${x.land})` }));
/** Kurzbeschreibung der Stunden einer Landesregel. */
export function stunden(land: Land, l: Lang): string {
  const r = REGELN[land]; const p: string[] = [];
  if (r.ab !== null && r.bis !== null) p.push(T(l, `zwischen ${r.ab} und ${r.bis} Uhr`, `between ${r.ab}:00 and ${r.bis}:00`));
  else if (r.ab !== null) p.push(T(l, `ab ${r.ab} Uhr`, `from ${r.ab}:00`));
  else if (r.bis !== null) p.push(T(l, `Ende spätestens ${r.bis} Uhr`, `ending by ${r.bis}:00`));
  if (r.dauer !== null) p.push(T(l, `höchstens ${r.dauer} Stunden`, `${r.dauer} hours at most`));
  return p.length ? p.join(', ') : T(l, 'außerhalb der Hauptgottesdienstzeit, sonst ohne feste Uhrzeit im Gesetz', 'outside main church service times; no fixed hours in the act');
}

/* ------------------------------------------------------------------ Darf dieser Sonntag freigegeben werden? */
function regelSpec(l: Lang, a: Args = {}): ToolSpec {
  const y0 = Number(a.jahr ?? 2026);
  const def = String(a.sonntag ?? kirchentage(y0).advent[0]);
  return {
    inputs: [fLand(l, String(a.land ?? 'NW')), fJahr(l, y0), { kind: 'select', id: 'sonntag', label: T(l, 'Sonntag', 'Sunday'), def, options: sonntagOpts(l) }],
    run: (v) => {
      const land = s(v, 'land') as Land, y = Number(s(v, 'jahr')), d = s(v, 'sonntag');
      const r = REGELN[land], p = pruefe(land, d), bild = jahresbild(land, y);
      const out: ToolOut = {
        label: T(l, `${LAND_NAME[land].de}, ${dWeek(d, l)}`, `${LAND_NAME[land].en}, ${dWeek(d, l)}`),
        value: p.moeglich ? T(l, 'Freigabe möglich', 'Can be released') : T(l, 'Gesperrt', 'Barred'),
        sub: p.moeglich
          ? (p.hinweis?.[l] ?? T(l, `Das ${r.gesetz} sperrt diesen Sonntag nicht. Offen ist er erst, wenn die Stadt ihn freigibt.`, `The ${r.gesetz} does not bar this Sunday. Shops open only if the town releases it.`))
          : T(l, `Gesperrt durch ${r.gesetz} ${r.para}: ${p.gruende.map((g) => sperrText(g, l)).join(', ')}.`, `Barred by ${r.gesetz} ${r.para}: ${p.gruende.map((g) => sperrText(g, l)).join(', ')}.`),
        rows: [
          [T(l, 'Höchstzahl je Jahr', 'Maximum per year'), num(r.max, l)],
          [T(l, 'Öffnungszeit', 'Opening hours'), stunden(land, l)],
          [T(l, `Mögliche Sonntage ${y}`, `Possible Sundays ${y}`), `${num(bild.moeglich.length, l)} / ${num(bild.alle.length, l)}`],
          [T(l, 'Wer freigibt', 'Who releases'), r.wer[l]],
        ],
        table: {
          caption: T(l, `Gesperrte Sonntage ${y} in ${LAND_NAME[land].de} nach ${r.gesetz} ${r.para}`, `Barred Sundays ${y} in ${LAND_NAME[land].en} under ${r.gesetz} ${r.para}`),
          headers: [T(l, 'Sonntag', 'Sunday'), T(l, 'Grund', 'Reason')],
          rows: bild.gesperrt.map((g) => [dShort(g.iso, l), g.gruende.map((x) => sperrText(x, l)).join(', ')]),
        },
        note: r.extra?.[l],
      };
      return out;
    },
  };
}

/* ------------------------------------------------------------------ Termine einer Stadt in einem Jahr */
function stadtSpec(l: Lang, a: Args = {}): ToolSpec {
  const land = a.land ? String(a.land) : undefined;
  return {
    inputs: [{ kind: 'select', id: 'stadt', label: T(l, 'Stadt', 'Town'), def: String(a.stadt ?? (land ? staedteIn(land as Land)[0]?.id : 'koeln') ?? 'koeln'), options: stadtOpts(l, land) }, fJahr(l, Number(a.jahr ?? 2026))],
    run: (v) => {
      const st = stadtById(s(v, 'stadt'))!; const y = Number(s(v, 'jahr'));
      const list = st.termine.filter((t) => t.datum.startsWith(String(y)));
      const offen = status(st, y) === 'veroeffentlicht';
      const bezirke = new Set(list.map((t) => t.bereich ?? '')).size;
      return {
        label: T(l, `${st.name}: freigegebene Sonn- und Feiertage ${y}`, `${stadtName(st, l)}: approved Sundays and holidays ${y}`),
        value: list.length ? T(l, `${num(list.length, l)} Termine`, `${num(list.length, l)} dates`) : offen ? T(l, 'keiner', 'none') : T(l, 'noch nicht veröffentlicht', 'not yet published'),
        sub: list.length ? T(l, `in ${num(bezirke, l)} ${bezirke === 1 ? 'Gebiet' : 'Gebieten'}, laut ${st.quellen[list[0].quelle].herausgeber}`, `in ${num(bezirke, l)} ${bezirke === 1 ? 'area' : 'areas'}, according to ${st.quellen[list[0].quelle].herausgeber}`) : T(l, 'Ohne amtliche Bekanntmachung tragen wir kein Datum ein.', 'Without an official notice we enter no date.'),
        rows: list.slice(0, 5).map((t) => [dShort(t.datum, l), [t.bereich, t.zeit].filter(Boolean).join(', ')] as [string, string]),
        table: list.length ? { caption: T(l, `${st.name} ${y}: alle Termine mit Anlass und Gebiet`, `${stadtName(st, l)} ${y}: every date with occasion and area`), headers: [T(l, 'Datum', 'Date'), T(l, 'Gebiet', 'Area'), T(l, 'Anlass', 'Occasion'), T(l, 'Uhrzeit', 'Hours')], rows: list.map((t) => [dShort(t.datum, l), t.bereich ?? '–', t.anlass ?? '–', t.zeit ?? '–']) } : undefined,
        note: T(l, `Quelle: ${st.quellen.map((q) => q.herausgeber).filter((x, i, a2) => a2.indexOf(x) === i).join(', ')}, gelesen am ${dLong(st.quellen[0]?.gelesen ?? '2026-10-29', l)}.`, `Source: ${st.quellen.map((q) => q.herausgeber).filter((x, i, a2) => a2.indexOf(x) === i).join(', ')}, read on ${dLong(st.quellen[0]?.gelesen ?? '2026-10-29', l)}.`),
      };
    },
  };
}

/* ------------------------------------------------------------------ Advent: welche Adventssonntage sind möglich? */
function adventSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fLand(l, String(a.land ?? 'NW')), fJahr(l, Number(a.jahr ?? 2026))],
    run: (v) => {
      const land = s(v, 'land') as Land, y = Number(s(v, 'jahr'));
      const k = kirchentage(y), r = REGELN[land];
      const ps = k.advent.map((d) => pruefe(land, d));
      const ok = ps.filter((p) => p.moeglich).length;
      const inLand = STAEDTE.filter((x) => x.land === land).flatMap((x) => x.termine.filter((t) => k.advent.includes(t.datum)).map((t) => ({ x, t })));
      return {
        label: T(l, `Adventssonntage ${y} in ${LAND_NAME[land].de}`, `Advent Sundays ${y} in ${LAND_NAME[land].en}`),
        value: T(l, `${num(ok, l)} von 4 möglich`, `${num(ok, l)} of 4 possible`),
        sub: r.advent[l],
        rows: ps.map((p, i) => [`${i + 1}. Advent, ${dShort(p.iso, l)}`, p.moeglich ? (p.hinweis ? T(l, 'möglich, mit Einschränkung', 'possible, with a limit') : T(l, 'möglich', 'possible')) : T(l, 'gesperrt', 'barred')] as [string, string]),
        table: inLand.length ? { caption: T(l, `Von Städten in ${LAND_NAME[land].de} freigegebene Adventssonntage ${y}`, `Advent Sundays ${y} released by towns in ${LAND_NAME[land].en}`), headers: [T(l, 'Datum', 'Date'), T(l, 'Stadt', 'Town'), T(l, 'Gebiet', 'Area'), T(l, 'Uhrzeit', 'Hours')], rows: inLand.map(({ x, t }) => [dShort(t.datum, l), stadtName(x, l), t.bereich ?? '–', t.zeit ?? '–']) } : undefined,
        note: inLand.length ? undefined : T(l, `Für ${y} ist in unserer Liste noch kein Adventssonntag einer Stadt in ${LAND_NAME[land].de} amtlich bekannt gemacht.`, `For ${y} our list has no officially published Advent Sunday of a town in ${LAND_NAME[land].en} yet.`),
      };
    },
  };
}

/* ------------------------------------------------------------------ Zwei Länder nebeneinander */
function vergleichSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fLand(l, String(a.land ?? 'NW'), 'land', T(l, 'Erstes Land', 'First state')), fLand(l, String(a.land2 ?? 'BY'), 'land2', T(l, 'Zweites Land', 'Second state')), fJahr(l, Number(a.jahr ?? 2027))],
    run: (v) => {
      const A = s(v, 'land') as Land, B = s(v, 'land2') as Land, y = Number(s(v, 'jahr'));
      const ra = REGELN[A], rb = REGELN[B], ba = jahresbild(A, y), bb = jahresbild(B, y);
      const row = (k: string, x: string, z: string) => [k, x, z];
      return {
        label: T(l, `${LAND_NAME[A].de} und ${LAND_NAME[B].de}: Sonntage je Jahr`, `${LAND_NAME[A].en} and ${LAND_NAME[B].en}: Sundays per year`),
        value: `${num(ra.max, l)} : ${num(rb.max, l)}`,
        sub: ra.max === rb.max ? T(l, 'Gleiche Höchstzahl, aber andere Sperren und Uhrzeiten.', 'Same maximum, different barred days and hours.') : T(l, `${LAND_NAME[ra.max > rb.max ? A : B].de} erlaubt mehr Sonntage.`, `${LAND_NAME[ra.max > rb.max ? A : B].en} allows more Sundays.`),
        rows: [[T(l, `Gesperrte Sonntage ${y}`, `Barred Sundays ${y}`), `${num(ba.gesperrt.length, l)} : ${num(bb.gesperrt.length, l)}`], [T(l, 'Adventssonntage möglich', 'Advent Sundays possible'), `${num(kirchentage(y).advent.filter((d) => pruefe(A, d).moeglich).length, l)} : ${num(kirchentage(y).advent.filter((d) => pruefe(B, d).moeglich).length, l)}`]],
        table: { caption: T(l, `Regeln im Vergleich, ${y}`, `Rules side by side, ${y}`), headers: ['', LAND_NAME[A][l], LAND_NAME[B][l]], rows: [
          row(T(l, 'Gesetz', 'Act'), `${ra.gesetz} ${ra.para}`, `${rb.gesetz} ${rb.para}`),
          row(T(l, 'Höchstzahl', 'Maximum'), num(ra.max, l), num(rb.max, l)),
          row(T(l, 'Uhrzeit', 'Hours'), stunden(A, l), stunden(B, l)),
          row(T(l, 'Advent', 'Advent'), ra.advent[l], rb.advent[l]),
          row(T(l, 'Anlass', 'Occasion'), ra.anlass[l], rb.anlass[l]),
          row(T(l, 'Wer freigibt', 'Who releases'), ra.wer[l], rb.wer[l]),
        ] },
      };
    },
  };
}

/* ------------------------------------------------------------------ Stand der Städte eines Landes */
function statusSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fLand(l, String(a.land ?? 'NW')), fJahr(l, Number(a.jahr ?? 2027))],
    run: (v) => {
      const land = s(v, 'land') as Land, y = Number(s(v, 'jahr'));
      const list = staedteIn(land);
      const pub = list.filter((x) => status(x, y) === 'veroeffentlicht');
      const lab = (x: (typeof list)[number]) => { const n = x.termine.filter((t) => t.datum.startsWith(String(y))).length; const st = status(x, y); return st === 'veroeffentlicht' ? T(l, `${num(n, l)} Termine`, `${num(n, l)} dates`) : st === 'nicht-gefunden' ? T(l, 'keine amtliche Quelle gefunden', 'no official source found') : T(l, 'noch nicht veröffentlicht', 'not yet published'); };
      return {
        label: T(l, `${LAND_NAME[land].de}: Städte mit Verordnung für ${y}`, `${LAND_NAME[land].en}: towns with a decision for ${y}`),
        value: `${num(pub.length, l)} / ${num(list.length, l)}`,
        sub: list.length ? T(l, `Städte in unserer Liste, deren Termine ${y} amtlich bekannt sind.`, `Towns on our list whose ${y} dates are officially published.`) : T(l, 'Für dieses Land führen wir noch keine Stadt.', 'We do not list a town in this state yet.'),
        rows: list.slice(0, 5).map((x) => [stadtName(x, l), lab(x)] as [string, string]),
        table: list.length ? { caption: T(l, `Alle Städte in ${LAND_NAME[land].de}, Stand ${y}`, `All towns in ${LAND_NAME[land].en}, status ${y}`), headers: [T(l, 'Stadt', 'Town'), T(l, 'Stand', 'Status')], rows: list.map((x) => [stadtName(x, l), lab(x)]) } : undefined,
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = { regel: regelSpec, stadt: stadtSpec, advent: adventSpec, vergleich: vergleichSpec, status: statusSpec };
export const TOOL_KINDS = [...Object.keys(SPECS), 'finder'];
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`simulateur inconnu : ${kind}`);
  return f(l, arg);
}
/** Lance un simulateur avec ses valeurs par défaut (ou celles données) : sert aux pages et aux tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
