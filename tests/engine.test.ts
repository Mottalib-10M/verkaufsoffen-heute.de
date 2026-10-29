import { describe, it, expect } from 'vitest';
import { ostersonntag, ostersonntagMeeus, bussUndBettag, feiertage, LAENDER, nthWeekday, uebersicht } from '../src/lib/engine/feiertage';

describe('Ostern', () => {
  it('stimmt mit der Osterfesttabelle der PTB überein', () => {
    // PTB, Osterfesttabelle 1980–2031 (Auswahl)
    expect(ostersonntag(2024)).toBe('2024-03-31');
    expect(ostersonntag(2025)).toBe('2025-04-20');
    expect(ostersonntag(2026)).toBe('2026-04-05');
    expect(ostersonntag(2027)).toBe('2027-03-28');
    expect(ostersonntag(2028)).toBe('2028-04-16');
    expect(ostersonntag(2029)).toBe('2029-04-01');
    expect(ostersonntag(2030)).toBe('2030-04-21');
    expect(ostersonntag(1981)).toBe('1981-04-19');
    expect(ostersonntag(2019)).toBe('2019-04-21');
  });
  it('liefert für 1600 bis 2600 dasselbe wie der Algorithmus von Meeus', () => {
    for (let y = 1600; y <= 2600; y++) expect(ostersonntag(y)).toBe(ostersonntagMeeus(y));
  });
});
describe('Feste Regeln', () => {
  it('Buß- und Bettag', () => {
    expect(bussUndBettag(2026)).toBe('2026-11-18');
    expect(bussUndBettag(2027)).toBe('2027-11-17');
    expect(bussUndBettag(2028)).toBe('2028-11-22');
    for (let y = 2000; y < 2100; y++) { const d = Number(bussUndBettag(y).slice(8)); expect(d >= 16 && d <= 22).toBe(true); }
  });
  it('Zeitumstellung und Muttertag', () => {
    expect(nthWeekday(2027, 3, 0, -1)).toBe('2027-03-28');
    expect(nthWeekday(2027, 10, 0, -1)).toBe('2027-10-31');
    expect(nthWeekday(2026, 10, 0, -1)).toBe('2026-10-25');
    expect(nthWeekday(2028, 3, 0, -1)).toBe('2028-03-26');
    expect(nthWeekday(2027, 5, 0, 2)).toBe('2027-05-09');
    expect(nthWeekday(2026, 5, 0, 2)).toBe('2026-05-10');
  });
});
describe('Feiertage je Land', () => {
  const count = (y: number, l: any, o?: any) => feiertage(y, l, o).length;
  it('Anzahl 2027', () => {
    const want: Record<string, number> = { BW: 12, BY: 13, BE: 10, BB: 12, HB: 10, HH: 10, HE: 10, MV: 11, NI: 10, NW: 11, RP: 11, SL: 12, SN: 11, ST: 11, SH: 10, TH: 11 };
    for (const l of LAENDER) expect([l, count(2027, l)]).toEqual([l, want[l]]);
    expect(count(2027, 'BY', 'std')).toBe(12);
    expect(count(2027, 'BY', 'augsburg')).toBe(14);
    expect(count(2027, 'SN', 'fl')).toBe(12);
    expect(count(2027, 'TH', 'fl')).toBe(12);
  });
  it('Berlin 2028: einmaliger Feiertag am 17. Juni', () => {
    expect(feiertage(2028, 'BE').some((f) => f.date === '2028-06-17')).toBe(true);
    expect(feiertage(2027, 'BE').some((f) => f.date.endsWith('06-17'))).toBe(false);
  });
  it('bewegliche Feiertage 2027', () => {
    const d = Object.fromEntries(feiertage(2027, 'NW').map((f) => [f.id, f.date]));
    expect(d).toMatchObject({ karfreitag: '2027-03-26', ostermontag: '2027-03-29', himmelfahrt: '2027-05-06', pfingstmontag: '2027-05-17', fronleichnam: '2027-05-27' });
  });
  it('Übersicht enthält jeden Tag einmal', () => {
    const u = uebersicht(2027); expect(new Set(u.map((x) => x.id)).size).toBe(u.length);
  });
});
import { berlinInstant } from '../src/lib/zeit';
describe('Deutsche Zeit', () => {
  it('Mitternacht und Umstellung', () => {
    expect(berlinInstant('2027-03-28', '02:00')).toBe('2027-03-28T01:00:00.000Z');
    expect(berlinInstant('2027-10-31', '03:00')).toBe('2027-10-31T01:00:00.000Z');
    expect(berlinInstant('2027-01-01')).toBe('2026-12-31T23:00:00.000Z');
    expect(berlinInstant('2027-05-16')).toBe('2027-05-15T22:00:00.000Z');
  });
});

import { REGELN, advente, kirchentage, pruefe, jahresbild, sonntage } from '../src/lib/engine/regeln';
import { STAEDTE, alleTermine } from '../src/lib/staedte';
import { icsDatei, zeitspanne } from '../src/lib/ics';
import P from '../src/data/params-2026.json';

describe('Kirchenjahr', () => {
  it('Adventssonntage', () => {
    expect(advente(2026)).toEqual(['2026-11-29', '2026-12-06', '2026-12-13', '2026-12-20']);
    expect(advente(2027)).toEqual(['2027-11-28', '2027-12-05', '2027-12-12', '2027-12-19']);
    expect(advente(2022)[3]).toBe('2022-12-18');
    expect(advente(2023)[3]).toBe('2023-12-24'); // Heiligabend am Sonntag = 4. Advent
    for (let y = 2000; y < 2100; y++) { const a = advente(y); expect(a[0] >= `${y}-11-27` && a[0] <= `${y}-12-03`).toBe(true); }
  });
  it('Totensonntag, Volkstrauertag, Palm- und Pfingstsonntag 2026/2027', () => {
    expect(kirchentage(2026)).toMatchObject({ palmsonntag: '2026-03-29', ostersonntag: '2026-04-05', pfingstsonntag: '2026-05-24', volkstrauertag: '2026-11-15', totensonntag: '2026-11-22' });
    expect(kirchentage(2027)).toMatchObject({ palmsonntag: '2027-03-21', ostersonntag: '2027-03-28', pfingstsonntag: '2027-05-16', volkstrauertag: '2027-11-14', totensonntag: '2027-11-21' });
  });
  it('52 oder 53 Sonntage', () => { expect(sonntage(2026).length).toBe(52); expect(sonntage(2027).length).toBe(52); expect(sonntage(2028).length).toBe(53); });
});

describe('Regeln der Länder (Wortlaut)', () => {
  it('Höchstzahlen', () => {
    const want: Record<string, number> = { BW: 3, BY: 4, BE: 8, BB: 5, HB: 4, HH: 4, HE: 4, MV: 4, NI: 6, NW: 8, RP: 4, SL: 4, SN: 4, ST: 4, SH: 4, TH: 4 };
    for (const l of LAENDER) expect([l, REGELN[l].max]).toEqual([l, want[l]]);
  });
  it('Ostersonntag überall außer Thüringen gesperrt', () => {
    for (const l of LAENDER) expect([l, pruefe(l, '2027-03-28').moeglich]).toEqual([l, l === 'TH']);
  });
  it('Advent 2026', () => {
    expect(pruefe('BY', '2026-11-29').moeglich).toBe(true);   // 1. Advent im November
    expect(pruefe('BY', '2026-12-06').moeglich).toBe(false);  // Advent im Dezember
    expect(pruefe('RP', '2026-11-29').moeglich).toBe(true);
    expect(pruefe('HE', '2026-11-29').moeglich).toBe(false);
    expect(pruefe('SN', '2026-12-20').moeglich).toBe(true);
    expect(pruefe('BW', '2026-12-06').moeglich).toBe(false);
    expect(pruefe('TH', '2026-12-06').moeglich).toBe(true);
    expect(pruefe('TH', '2026-12-13').moeglich).toBe(false);
    expect(pruefe('MV', '2026-12-06').moeglich).toBe(false);
    expect(pruefe('MV', '2026-11-29').moeglich).toBe(true);
    expect(pruefe('NW', '2026-12-13').hinweis).toBeDefined();
  });
  it('Volkstrauertag und Totensonntag in dreizehn Ländern gesperrt', () => {
    const n = LAENDER.filter((l) => !pruefe(l, '2027-11-14').moeglich && !pruefe(l, '2027-11-21').moeglich).length;
    expect(n).toBe(13);
  });
  it('3. Oktober 2027 (Sonntag)', () => {
    const gesperrt = LAENDER.filter((l) => !pruefe(l, '2027-10-03').moeglich).sort();
    expect(gesperrt).toEqual(['HB', 'HH', 'MV', 'NI', 'NW', 'RP', 'SN']);
  });
  it('Niedersachsen: Palmsonntag und 27. Dezember', () => {
    expect(pruefe('NI', '2026-03-29').moeglich).toBe(false);
    expect(pruefe('NI', '2026-12-27').moeglich).toBe(false);
  });
  it('Werktag ist nie ein verkaufsoffener Sonntag', () => { expect(pruefe('BE', '2026-12-07').moeglich).toBe(false); });
  it('jedes Jahr hat mögliche Sonntage', () => { for (const l of LAENDER) expect(jahresbild(l, 2027).moeglich.length).toBeGreaterThan(30); });
});

describe('Städte (src/data/staedte.json)', () => {
  const quellen = (P as any).sources as Record<string, unknown>;
  it('jede Regel verweist auf eine Quelle', () => { for (const l of LAENDER) expect(quellen[REGELN[l].quelle]).toBeDefined(); });
  it('Quellen: https, Lesedatum, keine Sammelseite oder Presse', () => {
    const verboten = /verkaufsoffener-sonntag\.com|kaufsonntag|opensunday|oeffnungszeitenbuch|wikipedia|waz\.de|express\.de|rp-online|bild\.de/i;
    for (const s of STAEDTE) for (const q of s.quellen) {
      expect([s.id, /^https?:\/\//.test(q.url)]).toEqual([s.id, true]);
      expect([s.id, /^\d{4}-\d{2}-\d{2}$/.test(q.gelesen)]).toEqual([s.id, true]);
      expect([s.id, verboten.test(q.url)]).toEqual([s.id, false]);
    }
  });
  it('jeder Termin hat eine gültige Quelle und ein ISO-Datum 2026/2027', () => {
    for (const t of alleTermine()) {
      expect(/^202[67]-\d{2}-\d{2}$/.test(t.datum)).toBe(true);
      expect(t.stadt.quellen[t.quelle]).toBeDefined();
    }
  });
  it('jeder Termin ist nach dem Gesetz seines Landes möglich', () => {
    const fehler: string[] = [];
    for (const t of alleTermine()) {
      const p = pruefe(t.stadt.land, t.datum);
      const feiertag = REGELN[t.stadt.land].feiertage && feiertage(Number(t.datum.slice(0, 4)), t.stadt.land).some((f) => f.date === t.datum);
      if (!p.moeglich && !feiertag) fehler.push(`${t.stadt.id} ${t.datum} ${p.gruende.join(',')}`);
    }
    expect(fehler).toEqual([]);
  });
  it('Status passt zu den Terminen', () => {
    for (const s of STAEDTE) for (const y of [2026, 2027]) {
      const n = s.termine.filter((t) => t.datum.startsWith(String(y))).length;
      const st = y === 2026 ? s.status2026 : s.status2027;
      if (n > 0) expect([s.id, y, st]).toEqual([s.id, y, 'veroeffentlicht']);
    }
  });
  it('kein Geschäft und kein Einkaufszentrum mit Namen', () => {
    const marken = /IKEA|Westfield|Höffner|Sconto|Famila|CITTI|designer outlet|Marler Stern|Durlach Center|Elbenwald/i;
    for (const t of alleTermine()) expect(marken.test(`${t.anlass} ${t.bereich}`)).toBe(false);
  });
});

describe('Kalenderdatei', () => {
  it('Uhrzeiten lesen', () => {
    expect(zeitspanne('13-18 Uhr')).toEqual([780, 1080]);
    expect(zeitspanne('12:30–17 Uhr')).toEqual([750, 1020]);
    expect(zeitspanne('ab 13 Uhr')).toEqual([780, null]);
    expect(zeitspanne(null)).toBeNull();
  });
  it('RFC 5545: Zeilen ≤ 75 Oktette, CRLF, Zeitzone', () => {
    const ics = icsDatei(alleTermine().slice(0, 20), 'de', '20261029T120000Z', 'test');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('TZID:Europe/Berlin');
    for (const line of ics.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(20);
  });
});
