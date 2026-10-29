/**
 * Die Regeln der 16 Ladenöffnungsgesetze für verkaufsoffene Sonntage, gelesen am 29. Oktober 2026 im
 * amtlichen Text (params-2026.json > sources, Schlüssel lo-xx). Jede Zahl hier steht so im Gesetz.
 *
 * Eine Sperre ist ein Sonntag, den die Gemeinde nach dem Landesgesetz nie freigeben darf. `pruefe()` sagt
 * für einen Sonntag und ein Land, ob eine Freigabe rechtlich möglich ist und warum nicht. Ob die Stadt
 * diesen Sonntag wirklich freigegeben hat, steht nur in ihrer Verordnung (src/data/staedte.json).
 */
import { ostersonntag, fromIso, toIso, dayNum, weekday, feiertage, LAENDER, type Land } from './feiertage';

export type Sperre =
  | 'palmsonntag' | 'ostersonntag' | 'pfingstsonntag' | 'volkstrauertag' | 'totensonntag'
  | 'advent' | 'advent-dez' | 'dezember' | 'dezember-ausser-advent1' | 'th-advent'
  | 'feiertag' | 'feiertag-dez' | 'neujahr' | 'heilige-drei-koenige' | 'maifeiertag' | 'einheit' | 'allerheiligen'
  | 'weihnachten' | 'heiligabend' | 'silvester' | '27-dezember' | 'vor-montag-mai-okt';

export interface Regel {
  land: Land;
  /** Kurzname des Gesetzes und Paragraf. */
  gesetz: string; para: string; quelle: string;
  /** Höchstzahl je Jahr (Gemeinde), so im Gesetz. */
  max: number;
  /** Zusätzliche Tage, die das Gesetz außerhalb der Höchstzahl erlaubt. */
  extra?: { de: string; en: string };
  /** Sonn- und Feiertage (true) oder nur Sonntage (false). */
  feiertage: boolean;
  /** Stunden: frühester Beginn, spätestes Ende, längste Dauer (null = im Gesetz nicht festgelegt). */
  ab: number | null; bis: number | null; dauer: number | null;
  /** Wer freigibt und in welcher Form. */
  wer: { de: string; en: string };
  /** Was der Anlass sein muss. */
  anlass: { de: string; en: string };
  sperren: Sperre[];
  /** Adventsregel in einem Satz. */
  advent: { de: string; en: string };
  /** Stand des Textes, wie ihn das Landesportal zeigt. */
  stand: string;
}

const R = (r: Regel) => r;
export const REGELN: Record<Land, Regel> = {
  BW: R({ land: 'BW', gesetz: 'LadÖG', para: '§ 8', quelle: 'lo-bw', max: 3, feiertage: true, ab: null, bis: 18, dauer: 5,
    wer: { de: 'zuständige Behörde (Gemeinde), nach Anhörung der Kirchen', en: 'the competent authority (the town), after hearing the churches' },
    anlass: { de: 'örtliche Feste, Märkte, Messen oder ähnliche Veranstaltungen', en: 'local festivals, markets, trade fairs or similar events' },
    sperren: ['advent', 'feiertag-dez', 'ostersonntag', 'pfingstsonntag'],
    advent: { de: 'Kein Adventssonntag, kein Feiertag im Dezember.', en: 'No Advent Sunday, no December holiday.' }, stand: '10.02.2026' }),
  BY: R({ land: 'BY', gesetz: 'BayLadSchlG', para: 'Art. 6', quelle: 'lo-by', max: 4, feiertage: true, ab: 10, bis: 18, dauer: 5,
    wer: { de: 'Gemeinde durch Rechtsverordnung', en: 'the municipality, by ordinance' },
    anlass: { de: 'besonderer Anlass: Märkte, Messen, große kulturelle, religiöse, traditionelle, historische oder sportliche Ereignisse und Feste', en: 'a special occasion: markets, fairs, major cultural, religious, traditional, historical or sporting events and festivals' },
    sperren: ['neujahr', 'heilige-drei-koenige', 'ostersonntag', 'maifeiertag', 'pfingstsonntag', 'allerheiligen', 'volkstrauertag', 'totensonntag', 'advent-dez', 'weihnachten', 'heiligabend', 'silvester'],
    advent: { de: 'Adventssonntage im Dezember gesperrt; ein 1. Advent Ende November ist möglich.', en: 'Advent Sundays in December are barred; a first Advent Sunday in late November is possible.' }, stand: '25.07.2025, in Kraft seit 01.08.2025' }),
  BE: R({ land: 'BE', gesetz: 'BerlLadÖffG', para: '§ 6', quelle: 'lo-be', max: 8, feiertage: true, ab: 13, bis: 20, dauer: null,
    extra: { de: 'dazu je Geschäft bis zu 2 Tage aus eigenem Anlass (Jubiläum, Straßenfest), zwei Wochen vorher beim Bezirksamt angezeigt', en: 'plus up to 2 days per shop for its own occasion (anniversary, street fair), notified to the district office two weeks ahead' },
    wer: { de: 'Senatsverwaltung durch Allgemeinverfügung', en: 'the Senate administration, by general order' },
    anlass: { de: 'im öffentlichen Interesse, ohne Bindung an ein einzelnes Fest', en: 'in the public interest, not tied to one specific event' },
    sperren: ['neujahr', 'maifeiertag', 'ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'heiligabend', 'feiertag-dez'],
    advent: { de: 'Adventssonntage sind möglich, nicht aber der 24. Dezember und Feiertage im Dezember.', en: 'Advent Sundays are possible, but not 24 December or December holidays.' }, stand: '13.10.2010' }),
  BB: R({ land: 'BB', gesetz: 'BbgLöG', para: '§ 5', quelle: 'lo-bb', max: 5, feiertage: true, ab: 13, bis: 20, dauer: null,
    extra: { de: 'dazu 1 Tag für ein regionales Ereignis im betroffenen Gebiet (zusammen höchstens 5 je Gebiet)', en: 'plus 1 day for a regional event in the area concerned (no more than 5 per area in total)' },
    wer: { de: 'örtliche Ordnungsbehörde durch ordnungsbehördliche Verordnung', en: 'the local public order authority, by ordinance' },
    anlass: { de: 'besondere Ereignisse', en: 'special events' },
    sperren: ['ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'weihnachten'],
    advent: { de: 'Adventssonntage sind möglich, höchstens zwei Sonntage in vier Wochen.', en: 'Advent Sundays are possible, no more than two Sundays within four weeks.' }, stand: 'aktuelle Fassung bravors' }),
  HB: R({ land: 'HB', gesetz: 'Bremisches Ladenschlussgesetz', para: '§ 10', quelle: 'lo-hb', max: 4, feiertage: true, ab: 11, bis: 18, dauer: 5,
    wer: { de: 'Senat (Stadt Bremen) und Magistrat (Bremerhaven) durch Rechtsverordnung', en: 'the Senate (City of Bremen) and the Magistrat (Bremerhaven), by ordinance' },
    anlass: { de: 'Märkte, Messen oder ähnliche Veranstaltungen', en: 'markets, trade fairs or similar events' },
    sperren: ['neujahr', 'ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'advent', 'dezember', 'maifeiertag', 'einheit', 'vor-montag-mai-okt'],
    advent: { de: 'Kein Adventssonntag und kein Sonntag im Dezember.', en: 'No Advent Sunday and no Sunday in December.' }, stand: '24.03.2026' }),
  HH: R({ land: 'HH', gesetz: 'LÖG Hamburg', para: '§ 8', quelle: 'lo-hh', max: 4, feiertage: false, ab: null, bis: 18, dauer: 5,
    wer: { de: 'Senat oder die von ihm bestimmten Stellen durch Rechtsverordnung', en: 'the Senate or the bodies it designates, by ordinance' },
    anlass: { de: 'besondere Ereignisse', en: 'special events' },
    sperren: ['dezember', 'advent', 'ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'feiertag'],
    advent: { de: 'Kein Adventssonntag und kein Sonntag im Dezember.', en: 'No Advent Sunday and no Sunday in December.' }, stand: '15.12.2009' }),
  HE: R({ land: 'HE', gesetz: 'HLöG', para: '§ 6', quelle: 'lo-he', max: 4, feiertage: true, ab: null, bis: 20, dauer: 6,
    wer: { de: 'Gemeinde durch Allgemeinverfügung, spätestens drei Monate vorher bekannt gemacht', en: 'the municipality, by general order published at least three months ahead' },
    anlass: { de: 'Märkte, Messen oder besondere örtliche Ereignisse mit eigenem Besucherstrom', en: 'markets, trade fairs or special local events that draw their own crowds' },
    sperren: ['advent', 'weihnachten', 'ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag'],
    advent: { de: 'Kein Adventssonntag.', en: 'No Advent Sunday.' }, stand: '13.12.2019' }),
  MV: R({ land: 'MV', gesetz: 'ÖffZG M-V', para: '§ 6', quelle: 'lo-mv', max: 4, feiertage: false, ab: null, bis: null, dauer: null,
    extra: { de: 'Bäder- und Ausflugsorte haben eine eigene Regelung (§ 5); dazu 4 Samstage bis 24 Uhr', en: 'spa and resort towns follow their own rule (section 5); plus 4 Saturdays until midnight' },
    wer: { de: 'zuständige Behörde', en: 'the competent authority' },
    anlass: { de: 'besonderer Anlass', en: 'a special occasion' },
    sperren: ['ostersonntag', 'pfingstsonntag', 'dezember-ausser-advent1', 'feiertag'],
    advent: { de: 'Im Dezember nur der 1. Advent.', en: 'In December only the first Advent Sunday.' }, stand: '10.01.2024' }),
  NI: R({ land: 'NI', gesetz: 'NLöffVZG', para: '§ 5', quelle: 'lo-ni', max: 6, feiertage: false, ab: null, bis: null, dauer: 5,
    extra: { de: 'höchstens 4 je Ortsbereich; anerkannte Ausflugsorte bis 8', en: 'no more than 4 per district; recognised resort towns up to 8' },
    wer: { de: 'zuständige Behörde auf Antrag der Geschäfte oder ihrer Vereinigung', en: 'the competent authority, on application by the shops or their association' },
    anlass: { de: 'besonderer Anlass, öffentliches Interesse an der Belebung oder ein sonstiger Sachgrund', en: 'a special occasion, a public interest in reviving the town, or another objective reason' },
    sperren: ['palmsonntag', 'ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'advent', 'feiertag', '27-dezember'],
    advent: { de: 'Kein Adventssonntag.', en: 'No Advent Sunday.' }, stand: 'Fassung ab 01.07.2019' }),
  NW: R({ land: 'NW', gesetz: 'LÖG NRW', para: '§ 6', quelle: 'lo-nw', max: 8, feiertage: true, ab: 13, bis: null, dauer: 5,
    extra: { de: 'nicht zwei Sonntage hintereinander; in Bezirken zusammen bis 16 je Gemeinde', en: 'never two Sundays in a row; up to 16 per town when split by district' },
    wer: { de: 'örtliche Ordnungsbehörde durch Verordnung', en: 'the local public order authority, by ordinance' },
    anlass: { de: 'öffentliches Interesse: Feste, Märkte, Messen, Stärkung des Handels, Belebung der Zentren, Sichtbarkeit der Stadt', en: 'a public interest: festivals, markets, fairs, supporting retail, reviving centres, the town’s visibility' },
    sperren: ['volkstrauertag', 'totensonntag', 'allerheiligen', 'ostersonntag', 'pfingstsonntag', 'weihnachten', 'maifeiertag', 'einheit', 'heiligabend'],
    advent: { de: 'Für die ganze Stadt nur ein Adventssonntag; in Bezirken je einer, zusammen höchstens zwei.', en: 'Only one Advent Sunday town-wide; one per district, two at most in total.' }, stand: '30.03.2018' }),
  RP: R({ land: 'RP', gesetz: 'LadöffnG', para: '§ 10', quelle: 'lo-rp', max: 4, feiertage: false, ab: 11, bis: null, dauer: 5,
    wer: { de: 'verbandsfreie Gemeinde, Verbandsgemeinde oder Stadt durch Rechtsverordnung', en: 'the municipality, association of municipalities or town, by ordinance' },
    anlass: { de: 'kein bestimmter Anlass im Gesetz genannt', en: 'the act names no specific occasion' },
    sperren: ['ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'advent-dez', 'feiertag'],
    advent: { de: 'Adventssonntage im Dezember gesperrt; ein 1. Advent im November ist möglich.', en: 'Advent Sundays in December are barred; a first Advent Sunday in November is possible.' }, stand: '22.12.2015' }),
  SL: R({ land: 'SL', gesetz: 'LÖG Saarland', para: '§ 8', quelle: 'lo-sl', max: 4, feiertage: true, ab: null, bis: 18, dauer: 5,
    wer: { de: 'die Geschäfte selbst; Anzeige bei der Ortspolizeibehörde spätestens 14 Tage vorher', en: 'the shops themselves, notifying the local police authority at least 14 days ahead' },
    anlass: { de: 'kein Anlass im Gesetz verlangt', en: 'the act requires no occasion' },
    sperren: ['neujahr', 'maifeiertag', 'ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'dezember-ausser-advent1'],
    advent: { de: 'Im Dezember nur ein 1. Advent, der in den Dezember fällt.', en: 'In December only a first Advent Sunday that falls in December.' }, stand: '04.12.2017' }),
  SN: R({ land: 'SN', gesetz: 'SächsLadÖffG', para: '§ 8', quelle: 'lo-sn', max: 4, feiertage: false, ab: 12, bis: 18, dauer: null,
    extra: { de: 'dazu 1 Sonntag für ein regionales Ereignis im betroffenen Gebiet (höchstens 8 je Gemeinde)', en: 'plus 1 Sunday for a regional event in the area concerned (no more than 8 per town)' },
    wer: { de: 'Gemeinde durch Rechtsverordnung', en: 'the municipality, by ordinance' },
    anlass: { de: 'besonderer Anlass', en: 'a special occasion' },
    sperren: ['ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'heiligabend', 'silvester', 'feiertag'],
    advent: { de: 'Adventssonntage sind möglich, nicht aber ein 24. oder 31. Dezember am Sonntag.', en: 'Advent Sundays are possible, but not 24 or 31 December on a Sunday.' }, stand: '01.12.2020' }),
  ST: R({ land: 'ST', gesetz: 'LÖffZeitG LSA', para: '§ 7', quelle: 'lo-st', max: 4, feiertage: true, ab: 11, bis: 20, dauer: 5,
    wer: { de: 'Gemeinde durch Erlaubnis', en: 'the municipality, by permit' },
    anlass: { de: 'besonderer Anlass oder öffentliches Interesse an der Belebung mit Entwicklungskonzept', en: 'a special occasion, or a public interest in reviving the town backed by a development plan' },
    sperren: ['neujahr', 'ostersonntag', 'volkstrauertag', 'totensonntag', 'weihnachten', 'heiligabend'],
    advent: { de: 'Adventssonntage sind möglich, nicht aber Heiligabend am Sonntag.', en: 'Advent Sundays are possible, but not Christmas Eve on a Sunday.' }, stand: '03.03.2025' }),
  SH: R({ land: 'SH', gesetz: 'LÖffZG', para: '§ 5', quelle: 'lo-sh', max: 4, feiertage: true, ab: null, bis: 18, dauer: 5,
    extra: { de: 'Bäderorte haben eine eigene Verordnung', en: 'seaside resorts have their own ordinance' },
    wer: { de: 'zuständige Behörde durch Rechtsverordnung', en: 'the competent authority, by ordinance' },
    anlass: { de: 'besonderer Anlass', en: 'a special occasion' },
    sperren: ['maifeiertag', 'ostersonntag', 'pfingstsonntag', 'volkstrauertag', 'totensonntag', 'advent', 'dezember', 'heiligabend'],
    advent: { de: 'Kein Adventssonntag und kein Sonntag im Dezember.', en: 'No Advent Sunday and no Sunday in December.' }, stand: '22.05.2026' }),
  TH: R({ land: 'TH', gesetz: 'ThürLadÖffG', para: '§ 10', quelle: 'lo-th', max: 4, feiertage: true, ab: 11, bis: 20, dauer: 6,
    wer: { de: 'Landkreis oder kreisfreie Stadt durch Rechtsverordnung', en: 'the district or independent town, by ordinance' },
    anlass: { de: 'besonderer Anlass; vermutet, wenn er schon in den drei Vorjahren zur Öffnung führte', en: 'a special occasion; presumed when it led to an opening in each of the three previous years' },
    sperren: ['th-advent'],
    advent: { de: 'Nur entweder der 1. oder der 2. Advent; sonst kein Sonntag im Dezember.', en: 'Only either the first or the second Advent Sunday; otherwise no Sunday in December.' }, stand: '17.02.2022' }),
};

/* ------------------------------------------------------------------ Kirchenjahr */
/** 4. Advent: der Sonntag am oder vor dem 24. Dezember; die drei anderen liegen je eine Woche davor. */
export function advente(y: number): string[] {
  const d24 = dayNum(y, 12, 24); const a4 = d24 - weekday(d24);
  return [a4 - 21, a4 - 14, a4 - 7, a4].map(toIso);
}
export interface Kirchentage { palmsonntag: string; ostersonntag: string; pfingstsonntag: string; volkstrauertag: string; totensonntag: string; advent: string[] }
export function kirchentage(y: number): Kirchentage {
  const o = fromIso(ostersonntag(y)); const a = advente(y); const a1 = fromIso(a[0]);
  return { palmsonntag: toIso(o - 7), ostersonntag: toIso(o), pfingstsonntag: toIso(o + 49), volkstrauertag: toIso(a1 - 14), totensonntag: toIso(a1 - 7), advent: a };
}
/** Alle Sonntage eines Jahres. */
export function sonntage(y: number): string[] {
  const first = dayNum(y, 1, 1); const s = first + ((7 - weekday(first)) % 7); const out: string[] = [];
  for (let d = s; toIso(d).startsWith(String(y)); d += 7) out.push(toIso(d));
  return out;
}
export const istSonntag = (iso: string) => weekday(fromIso(iso)) === 0;
/** Der nächste Sonntag ab einem Tag (der Tag selbst, wenn er ein Sonntag ist). */
export function naechsterSonntag(iso: string): string { const d = fromIso(iso); return toIso(d + ((7 - weekday(d)) % 7)); }

/* ------------------------------------------------------------------ Prüfung */
export const SPERRE_TEXT: Record<Sperre, { de: string; en: string }> = {
  palmsonntag: { de: 'Palmsonntag', en: 'Palm Sunday' },
  ostersonntag: { de: 'Ostersonntag', en: 'Easter Sunday' },
  pfingstsonntag: { de: 'Pfingstsonntag', en: 'Whit Sunday' },
  volkstrauertag: { de: 'Volkstrauertag', en: 'National Day of Mourning' },
  totensonntag: { de: 'Totensonntag', en: 'Sunday of the Dead' },
  advent: { de: 'Adventssonntag', en: 'Advent Sunday' },
  'advent-dez': { de: 'Adventssonntag im Dezember', en: 'Advent Sunday in December' },
  dezember: { de: 'Sonntag im Dezember', en: 'Sunday in December' },
  'dezember-ausser-advent1': { de: 'Sonntag im Dezember (außer 1. Advent)', en: 'Sunday in December (other than the first Advent Sunday)' },
  'th-advent': { de: 'Adventssonntag oder Dezember-Sonntag (frei bleibt nur der 1. oder 2. Advent)', en: 'Advent or December Sunday (only the first or second Advent Sunday may be used)' },
  feiertag: { de: 'gesetzlicher Feiertag', en: 'public holiday' },
  'feiertag-dez': { de: 'Feiertag im Dezember', en: 'December holiday' },
  neujahr: { de: 'Neujahr', en: "New Year's Day" },
  'heilige-drei-koenige': { de: 'Heilige Drei Könige', en: 'Epiphany' },
  maifeiertag: { de: '1. Mai', en: '1 May' },
  einheit: { de: 'Tag der Deutschen Einheit', en: 'German Unity Day' },
  allerheiligen: { de: 'Allerheiligen', en: "All Saints' Day" },
  weihnachten: { de: '1. oder 2. Weihnachtstag', en: 'Christmas Day or Boxing Day' },
  heiligabend: { de: 'Heiligabend', en: 'Christmas Eve' },
  silvester: { de: 'Silvester', en: "New Year's Eve" },
  '27-dezember': { de: '27. Dezember', en: '27 December' },
  'vor-montag-mai-okt': { de: 'Sonntag vor einem 1. Mai oder 3. Oktober am Montag', en: 'Sunday before a 1 May or 3 October falling on a Monday' },
};

function trifft(s: Sperre, iso: string, land: Land, k: Kirchentage): boolean {
  const md = iso.slice(5); const dez = md.startsWith('12-');
  const ft = () => feiertage(Number(iso.slice(0, 4)), land).some((f) => f.date === iso);
  switch (s) {
    case 'palmsonntag': case 'ostersonntag': case 'pfingstsonntag': case 'volkstrauertag': case 'totensonntag': return k[s] === iso;
    case 'advent': return k.advent.includes(iso);
    case 'advent-dez': return k.advent.includes(iso) && dez;
    case 'dezember': return dez;
    case 'dezember-ausser-advent1': return dez && iso !== k.advent[0];
    case 'th-advent': return (k.advent.includes(iso) || dez) && iso !== k.advent[0] && iso !== k.advent[1];
    case 'feiertag': return ft();
    case 'feiertag-dez': return dez && ft();
    case 'neujahr': return md === '01-01';
    case 'heilige-drei-koenige': return md === '01-06';
    case 'maifeiertag': return md === '05-01';
    case 'einheit': return md === '10-03';
    case 'allerheiligen': return md === '11-01';
    case 'weihnachten': return md === '12-25' || md === '12-26';
    case 'heiligabend': return md === '12-24';
    case 'silvester': return md === '12-31';
    case '27-dezember': return md === '12-27';
    case 'vor-montag-mai-okt': return md === '04-30' || md === '10-02';
  }
}

export interface Pruefung { iso: string; land: Land; sonntag: boolean; moeglich: boolean; gruende: Sperre[]; hinweis?: { de: string; en: string } }
/** Darf dieser Sonntag in diesem Land überhaupt freigegeben werden? */
export function pruefe(land: Land, iso: string): Pruefung {
  const sonntag = istSonntag(iso);
  const k = kirchentage(Number(iso.slice(0, 4)));
  const gruende = sonntag ? REGELN[land].sperren.filter((s) => trifft(s, iso, land, k)) : [];
  let hinweis: Pruefung['hinweis'];
  if (sonntag && !gruende.length && land === 'NW' && k.advent.includes(iso)) hinweis = { de: 'Für die ganze Stadt darf nur einer der vier Adventssonntage freigegeben werden.', en: 'Only one of the four Advent Sundays may be released town-wide.' };
  if (sonntag && !gruende.length && land === 'TH' && (iso === k.advent[0] || iso === k.advent[1])) hinweis = { de: 'Möglich, aber nur einer der beiden: 1. oder 2. Advent.', en: 'Possible, but only one of the two: first or second Advent Sunday.' };
  return { iso, land, sonntag, moeglich: sonntag && !gruende.length, gruende, hinweis };
}
/** Sonntage eines Jahres, an denen eine Freigabe im Land rechtlich möglich ist, und die gesperrten. */
export function jahresbild(land: Land, y: number) {
  const all = sonntage(y).map((d) => pruefe(land, d));
  return { moeglich: all.filter((p) => p.moeglich), gesperrt: all.filter((p) => !p.moeglich), alle: all };
}
export { LAENDER };
