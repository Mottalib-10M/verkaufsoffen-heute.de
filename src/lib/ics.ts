/**
 * Kalenderdatei (.ics, RFC 5545) aus Terminen, im Browser erzeugt: nichts wird gesendet.
 * Mit Uhrzeit: Beginn und Ende in Europe/Berlin (VTIMEZONE mit den Umstellungsregeln der Sommerzeitverordnung);
 * ohne Uhrzeit: ganztägig.
 */
import type { Eintrag } from './staedte';

/** « 13-18 Uhr », « 12:30–17 Uhr », « ab 13 Uhr » → [Beginn, Ende] in Minuten, Ende null, wenn unbekannt. */
export function zeitspanne(zeit: string | null): [number, number | null] | null {
  if (!zeit) return null;
  const m = zeit.match(/(\d{1,2})(?:[:.](\d{2}))?\s*(?:-|–|bis)\s*(\d{1,2})(?:[:.](\d{2}))?/);
  if (m) return [Number(m[1]) * 60 + Number(m[2] ?? 0), Number(m[3]) * 60 + Number(m[4] ?? 0)];
  const ab = zeit.match(/ab\s*(\d{1,2})(?:[:.](\d{2}))?/);
  return ab ? [Number(ab[1]) * 60 + Number(ab[2] ?? 0), null] : null;
}
const esc = (x: string) => x.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const hm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}${String(min % 60).padStart(2, '0')}00`;
/** Zeilen über 75 Oktette falten (RFC 5545 § 3.1). */
function fold(line: string): string {
  const out: string[] = []; let cur = ''; let bytes = 0;
  for (const ch of line) { const b = new TextEncoder().encode(ch).length; if (bytes + b > 74) { out.push(cur); cur = ' ' + ch; bytes = 1 + b; } else { cur += ch; bytes += b; } }
  out.push(cur); return out.join('\r\n');
}
const VTZ = ['BEGIN:VTIMEZONE', 'TZID:Europe/Berlin', 'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT', 'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD', 'END:VTIMEZONE'];

export function icsDatei(list: Eintrag[], lang: 'de' | 'en', stamp: string, host = 'verkaufsoffen'): string {
  const T = (de: string, en: string) => (lang === 'de' ? de : en);
  const ev = list.flatMap((t, i) => {
    const d = t.datum.replace(/-/g, ''); const z = zeitspanne(t.zeit); const q = t.stadt.quellen[t.quelle];
    const next = new Date(Date.parse(`${t.datum}T12:00:00Z`) + 864e5).toISOString().slice(0, 10).replace(/-/g, '');
    const when = z ? [`DTSTART;TZID=Europe/Berlin:${d}T${hm(z[0])}`, `DTEND;TZID=Europe/Berlin:${d}T${hm(z[1] ?? z[0] + 300)}`] : [`DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${next}`];
    const title = T(`Verkaufsoffen: ${t.stadt.name}${t.bereich ? ` (${t.bereich})` : ''}`, `Shops open: ${t.stadt.en ?? t.stadt.name}${t.bereich ? ` (${t.bereich})` : ''}`);
    const desc = [t.anlass ? T(`Anlass: ${t.anlass}`, `Occasion: ${t.anlass}`) : '', t.zeit ? T(`Zeit: ${t.zeit}`, `Hours: ${t.zeit}`) : '', q ? T(`Quelle: ${q.herausgeber}, ${q.url}`, `Source: ${q.herausgeber}, ${q.url}`) : ''].filter(Boolean).join('\n');
    return ['BEGIN:VEVENT', `UID:${t.datum}-${t.stadt.id}-${i}@${host}`, `DTSTAMP:${stamp}`, ...when, `SUMMARY:${esc(title)}`, `DESCRIPTION:${esc(desc)}`, `LOCATION:${esc(t.stadt.name)}`, ...(q ? [`URL:${q.url}`] : []), 'TRANSP:TRANSPARENT', 'END:VEVENT'];
  });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Radif Partners//Verkaufsoffene Sonntage//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', ...VTZ, ...ev, 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
}
