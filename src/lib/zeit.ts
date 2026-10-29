/** Heure légale allemande → instant UTC (Sommerzeitverordnung § 2 : MESZ du dernier dimanche de mars, 2 h MEZ,
 *  au dernier dimanche d'octobre, 3 h MESZ). Sert aux comptes à rebours. */
import { nthWeekday, fromIso } from './engine/feiertage';
export function berlinInstant(dateIso: string, time = '00:00'): string {
  const y = Number(dateIso.slice(0, 4)), [hh, mm] = time.split(':').map(Number);
  const local = Date.UTC(y, Number(dateIso.slice(5, 7)) - 1, Number(dateIso.slice(8, 10)), hh, mm);
  const b = fromIso(nthWeekday(y, 3, 0, -1)) * 864e5 + 1 * 3600e3; // 2 h MEZ = 1 h UTC
  const e = fromIso(nthWeekday(y, 10, 0, -1)) * 864e5 + 1 * 3600e3; // 3 h MESZ = 1 h UTC
  const guessUtc = local - 3600e3; // MEZ
  const off = guessUtc > b && local - 7200e3 <= e ? 2 : 1;
  return new Date(local - off * 3600e3).toISOString();
}
