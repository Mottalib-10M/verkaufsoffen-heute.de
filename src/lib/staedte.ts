/**
 * Die Städte und ihre freigegebenen Sonntage (src/data/staedte.json). Jede Zeile trägt die Quelle der Stadt:
 * Verordnung, Allgemeinverfügung, Amtsblatt, Seite der Stadt oder ihres Stadtmarketings, gelesen am angegebenen Tag.
 * Keine Quelle gefunden = keine Zeile: die Seite schreibt dann „noch nicht veröffentlicht“.
 * Neu einlesen: python3 scripts/staedte-import.py <Ordner mit einer JSON-Datei je Stadt>.
 */
import DATA from '../data/staedte.json';
import type { Land } from './engine/feiertage';

export interface Termin { datum: string; anlass: string | null; bereich: string | null; zeit: string | null; quelle: number; eingeschraenkt?: boolean }
export interface Quelle { titel: string; herausgeber: string; art: string; url: string; gelesen: string }
export type Status = 'veroeffentlicht' | 'nicht-veroeffentlicht' | 'nicht-gefunden';
export interface Stadt { id: string; name: string; land: Land; termine: Termin[]; status2026: Status; status2027: Status; quellen: Quelle[]; notiz?: string; en?: string }

export const STAEDTE: Stadt[] = (DATA as { staedte: Stadt[] }).staedte;
export const stadtById = (id: string) => STAEDTE.find((s) => s.id === id);
export const staedteIn = (land: Land) => STAEDTE.filter((s) => s.land === land);
export const STAND = (DATA as { stand: string }).stand;

export interface Eintrag extends Termin { stadt: Stadt }
/** Alle Termine aller Städte (oder eines Landes), nach Datum. */
export function alleTermine(land?: Land): Eintrag[] {
  return STAEDTE.filter((s) => !land || s.land === land)
    .flatMap((s) => s.termine.map((t) => ({ ...t, stadt: s })))
    .sort((a, b) => a.datum.localeCompare(b.datum) || a.stadt.name.localeCompare(b.stadt.name, 'de'));
}
/** Termine ab einem Tag (eingeschlossen). */
export const ab = (list: Eintrag[], iso: string) => list.filter((t) => t.datum >= iso);
export const imJahr = (list: Eintrag[], y: number) => list.filter((t) => t.datum.startsWith(String(y)));
/** Englischer Name, wo er abweicht (Köln → Cologne). */
export const stadtName = (s: Stadt, lang: 'de' | 'en') => (lang === 'en' && s.en ? s.en : s.name);
export const status = (s: Stadt, y: number): Status => (y === 2026 ? s.status2026 : s.status2027);
