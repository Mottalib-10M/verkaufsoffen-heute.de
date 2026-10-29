/**
 * Gesetzliche Feiertage der 16 Länder, berechnet und nicht abgetippt.
 *
 * - Ostern: Gaußsche Osterformel in der Form der PTB (Lichtenberg 1997); die beweglichen Feiertage
 *   hängen daran (Karfreitag −2, Ostermontag +1, Christi Himmelfahrt +39, Pfingstmontag +50, Fronleichnam +60).
 * - Buß- und Bettag (Sachsen): Mittwoch vor dem letzten Sonntag des Kirchenjahres, also zwischen 16. und 22. November.
 * - Ein Feiertag, der auf einen Samstag oder Sonntag fällt, wird in Deutschland nicht nachgeholt.
 * - Teilweise Feiertage (nur in einem Teil des Landes) tragen eine Ortsregel `ort`.
 * Jede Liste stammt aus dem Feiertagsgesetz des Landes (params-2026.json > sources, Schlüssel ftg-xx).
 */

export type Land = 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE' | 'MV' | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';
export const LAENDER: Land[] = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'];
export const LAND_NAME: Record<Land, { de: string; en: string }> = {
  BW: { de: 'Baden-Württemberg', en: 'Baden-Württemberg' },
  BY: { de: 'Bayern', en: 'Bavaria' },
  BE: { de: 'Berlin', en: 'Berlin' },
  BB: { de: 'Brandenburg', en: 'Brandenburg' },
  HB: { de: 'Bremen', en: 'Bremen' },
  HH: { de: 'Hamburg', en: 'Hamburg' },
  HE: { de: 'Hessen', en: 'Hesse' },
  MV: { de: 'Mecklenburg-Vorpommern', en: 'Mecklenburg-Western Pomerania' },
  NI: { de: 'Niedersachsen', en: 'Lower Saxony' },
  NW: { de: 'Nordrhein-Westfalen', en: 'North Rhine-Westphalia' },
  RP: { de: 'Rheinland-Pfalz', en: 'Rhineland-Palatinate' },
  SL: { de: 'Saarland', en: 'Saarland' },
  SN: { de: 'Sachsen', en: 'Saxony' },
  ST: { de: 'Sachsen-Anhalt', en: 'Saxony-Anhalt' },
  SH: { de: 'Schleswig-Holstein', en: 'Schleswig-Holstein' },
  TH: { de: 'Thüringen', en: 'Thuringia' },
};

/* ------------------------------------------------------------------ Tage als ganze Zahlen (UTC) */
const MS = 86400000;
export const dayNum = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / MS;
export const fromIso = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return dayNum(y, m, d); };
export const toIso = (n: number) => new Date(n * MS).toISOString().slice(0, 10);
/** 0 = Sonntag … 6 = Samstag */
export const weekday = (n: number) => new Date(n * MS).getUTCDay();
export const isWeekend = (n: number) => { const w = weekday(n); return w === 0 || w === 6; };

/* ------------------------------------------------------------------ Ostern */
/** Ostersonntag nach der Gaußschen Osterformel, Fassung der PTB (Lichtenberg). Ergebnis als ISO-Datum. */
export function ostersonntag(x: number): string {
  const K = Math.floor(x / 100);
  const M = 15 + Math.floor((3 * K + 3) / 4) - Math.floor((8 * K + 13) / 25);
  const S = 2 - Math.floor((3 * K + 3) / 4);
  const A = x % 19;
  const D = (19 * A + M) % 30;
  const R = Math.floor((D + Math.floor(A / 11)) / 29);
  const OG = 21 + D - R;
  const SZ = 7 - ((x + Math.floor(x / 4) + S) % 7);
  const OE = 7 - (((OG - SZ) % 7) + 7) % 7;
  const OS = OG + OE; // Tag im März (32 = 1. April)
  return toIso(dayNum(x, 3, 1) + OS - 1);
}
/** Zweite, unabhängige Rechnung (anonymer gregorianischer Algorithmus, Meeus/Jones/Butcher) für die Tests. */
export function ostersonntagMeeus(y: number): string {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return toIso(dayNum(y, month, day));
}
/** Buß- und Bettag: der Mittwoch vor dem 23. November. */
export function bussUndBettag(y: number): string {
  const n23 = dayNum(y, 11, 23);
  const back = ((weekday(n23) - 3 + 7) % 7) || 7;
  return toIso(n23 - back);
}
/** n-ter Wochentag eines Monats (n = −1: letzter). wd 0 = Sonntag. */
export function nthWeekday(y: number, m: number, wd: number, n: number): string {
  if (n > 0) { const first = dayNum(y, m, 1); return toIso(first + ((wd - weekday(first) + 7) % 7) + 7 * (n - 1)); }
  const last = dayNum(y, m + 1, 1) - 1; return toIso(last - ((weekday(last) - wd + 7) % 7));
}

/* ------------------------------------------------------------------ Die Feiertage */
/** Ortsregel eines Feiertags, der nur in einem Teil des Landes gilt. */
export type Teil = 'by-mh' | 'augsburg' | 'sn-fl' | 'th-fl';
export interface FeiertagDef {
  id: string;
  name: { de: string; en: string };
  date: (y: number) => string | null;
  /** Länder, in denen der Tag landesweit gilt ('alle' = bundesweit). */
  laender: Land[] | 'alle';
  /** Länder, in denen er nur in einem Teil gilt, mit der Ortsregel. */
  teil?: Partial<Record<Land, Teil>>;
  /** Je Land das erste Jahr, ab dem der Tag gilt. */
  seit?: Partial<Record<Land, number>>;
}
const fix = (m: number, d: number) => (y: number) => toIso(dayNum(y, m, d));
const ost = (off: number) => (y: number) => toIso(fromIso(ostersonntag(y)) + off);
const REFORMATION: Land[] = ['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'];

export const FEIERTAGE: FeiertagDef[] = [
  { id: 'neujahr', name: { de: 'Neujahr', en: "New Year's Day" }, date: fix(1, 1), laender: 'alle' },
  { id: 'heilige-drei-koenige', name: { de: 'Heilige Drei Könige', en: 'Epiphany' }, date: fix(1, 6), laender: ['BW', 'BY', 'ST'] },
  { id: 'frauentag', name: { de: 'Internationaler Frauentag', en: "International Women's Day" }, date: fix(3, 8), laender: ['BE', 'MV'], seit: { BE: 2019, MV: 2023 } },
  { id: 'karfreitag', name: { de: 'Karfreitag', en: 'Good Friday' }, date: ost(-2), laender: 'alle' },
  { id: 'ostersonntag', name: { de: 'Ostersonntag', en: 'Easter Sunday' }, date: ost(0), laender: ['BB'] },
  { id: 'ostermontag', name: { de: 'Ostermontag', en: 'Easter Monday' }, date: ost(1), laender: 'alle' },
  { id: 'maifeiertag', name: { de: 'Tag der Arbeit', en: 'Labour Day' }, date: fix(5, 1), laender: 'alle' },
  { id: 'himmelfahrt', name: { de: 'Christi Himmelfahrt', en: 'Ascension Day' }, date: ost(39), laender: 'alle' },
  { id: 'pfingstsonntag', name: { de: 'Pfingstsonntag', en: 'Whit Sunday' }, date: ost(49), laender: ['BB'] },
  { id: 'pfingstmontag', name: { de: 'Pfingstmontag', en: 'Whit Monday' }, date: ost(50), laender: 'alle' },
  { id: 'fronleichnam', name: { de: 'Fronleichnam', en: 'Corpus Christi' }, date: ost(60), laender: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'], teil: { SN: 'sn-fl', TH: 'th-fl' } },
  { id: 'jahrestag-1953', name: { de: '75. Jahrestag des Volksaufstands vom 17. Juni 1953', en: '75th anniversary of the uprising of 17 June 1953' }, date: (y) => (y === 2028 ? '2028-06-17' : null), laender: ['BE'] },
  { id: 'friedensfest', name: { de: 'Augsburger Hohes Friedensfest', en: 'Augsburg Peace Festival' }, date: fix(8, 8), laender: [], teil: { BY: 'augsburg' } },
  { id: 'mariae-himmelfahrt', name: { de: 'Mariä Himmelfahrt', en: 'Assumption Day' }, date: fix(8, 15), laender: ['SL'], teil: { BY: 'by-mh' } },
  { id: 'weltkindertag', name: { de: 'Weltkindertag', en: "World Children's Day" }, date: fix(9, 20), laender: ['TH'], seit: { TH: 2019 } },
  { id: 'einheit', name: { de: 'Tag der Deutschen Einheit', en: 'German Unity Day' }, date: fix(10, 3), laender: 'alle' },
  { id: 'reformationstag', name: { de: 'Reformationstag', en: 'Reformation Day' }, date: fix(10, 31), laender: REFORMATION, seit: { HB: 2018, HH: 2018, NI: 2018, SH: 2018 } },
  { id: 'allerheiligen', name: { de: 'Allerheiligen', en: "All Saints' Day" }, date: fix(11, 1), laender: ['BW', 'BY', 'NW', 'RP', 'SL'] },
  { id: 'buss-und-bettag', name: { de: 'Buß- und Bettag', en: 'Day of Repentance and Prayer' }, date: bussUndBettag, laender: ['SN'] },
  { id: 'weihnachten-1', name: { de: '1. Weihnachtstag', en: 'Christmas Day' }, date: fix(12, 25), laender: 'alle' },
  { id: 'weihnachten-2', name: { de: '2. Weihnachtstag', en: 'Boxing Day (St Stephen’s Day)' }, date: fix(12, 26), laender: 'alle' },
];

/** Ortsregeln, die ein Besucher wählen kann. 'std' = der landesweite Kalender ohne Teil-Feiertage. */
export type Ort = 'std' | 'mh' | 'augsburg' | 'fl';
export const ORTE: Record<Land, Ort[]> = Object.fromEntries(LAENDER.map((l) => [l, l === 'BY' ? ['mh', 'std', 'augsburg'] : l === 'SN' || l === 'TH' ? ['std', 'fl'] : ['std']])) as Record<Land, Ort[]>;
/** Standard je Land: in Bayern hat die große Mehrheit der Gemeinden (1.708 von 2.056) Mariä Himmelfahrt. */
export const ORT_STANDARD = (l: Land): Ort => (l === 'BY' ? 'mh' : 'std');
const gilt = (t: Teil, ort: Ort) => (t === 'by-mh' ? ort === 'mh' || ort === 'augsburg' : t === 'augsburg' ? ort === 'augsburg' : ort === 'fl');

export interface Feiertag { id: string; date: string; name: { de: string; en: string }; teil: boolean; bundesweit: boolean }
/** Die Feiertage eines Landes in einem Jahr, nach Datum. `ort` wählt die Teil-Feiertage. */
export function feiertage(y: number, land: Land, ort: Ort = ORT_STANDARD(land)): Feiertag[] {
  const out: Feiertag[] = [];
  for (const f of FEIERTAGE) {
    const d = f.date(y); if (!d) continue;
    const seit = f.seit?.[land]; if (seit && y < seit) continue;
    const voll = f.laender === 'alle' || f.laender.includes(land);
    const t = f.teil?.[land];
    if (voll || (t && gilt(t, ort))) out.push({ id: f.id, date: d, name: f.name, teil: !voll, bundesweit: f.laender === 'alle' });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}
/** Alle Feiertage eines Jahres mit den Ländern, in denen sie gelten (für die Übersicht). */
export interface FeiertagZeile { id: string; date: string; name: { de: string; en: string }; laender: Land[]; teil: Land[] }
export function uebersicht(y: number): FeiertagZeile[] {
  const rows: FeiertagZeile[] = [];
  for (const f of FEIERTAGE) {
    const d = f.date(y); if (!d) continue;
    const ok = (l: Land) => { const s = f.seit?.[l]; return !s || y >= s; };
    const laender = (f.laender === 'alle' ? LAENDER : f.laender).filter(ok);
    const teil = (Object.keys(f.teil ?? {}) as Land[]).filter(ok);
    if (laender.length || teil.length) rows.push({ id: f.id, date: d, name: f.name, laender, teil });
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}
/** Feiertage, die auf einen Werktag (Montag bis Freitag) fallen. */
export const aufWerktag = (list: Feiertag[]) => list.filter((f) => !isWeekend(fromIso(f.date)));
