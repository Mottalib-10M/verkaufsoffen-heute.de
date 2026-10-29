# Seiten und Daten pflegen (de-verkaufsoffen)

## Aufbau

- **Eine Seite = ein Eintrag** in `src/content/guides/` (`defineGuide`, deutsch und englisch nebeneinander):
  - `termine.ts`: heute, 2026, 2027, Advent, Städteliste, Gesetze im Vergleich;
  - `laender.ts`: 16 Länderseiten;
  - `staedte-seiten.ts`: Seiten der großen Städte (Liste der geplanten Seiten: `src/lib/planned.ts`).
- Startseite: `src/content/home.ts` + `src/components/HomePage.astro` (Termin-Finder oben).
- Regeln der 16 Ladenöffnungsgesetze: `src/lib/engine/regeln.ts` (jede Zahl so im Gesetz, Quelle in `src/data/params-2026.json`).
- Termine der Städte: `src/data/staedte.json`, **nie von Hand bearbeiten**.
- Werkzeuge: Termin-Finder `src/components/vs/Finder.tsx` (Datum des Geräts, Kalenderdatei `src/lib/ics.ts`), Rechner `src/lib/tool-specs.ts` (regel, stadt, advent, vergleich, status).

## Termine aktualisieren (jährlich November bis Februar, sonst monatlich)

1. Je Stadt eine JSON-Datei recherchieren (Schema im Kopf von `scripts/staedte-import.py`): nur amtliche Quellen
   (Verordnung, Satzung, Allgemeinverfügung, Amtsblatt, Seite der Stadt oder ihres Stadtmarketings), mit Lesedatum.
   Keine Sammelseiten, keine Presse, keine Werbung. Keine Quelle = keine Zeile („noch nicht veröffentlicht“).
2. `python3 scripts/staedte-import.py <ordner> --stand AAAA-MM-JJ` (prüft Quellen, ersetzt Namen von Geschäften).
3. `npm run check` muss mit 0 Fehlern enden: Der Test „jeder Termin ist nach dem Gesetz seines Landes möglich“
   schlägt an, wenn ein Termin auf einen gesperrten Tag fällt.
4. Texte mit festen Aussagen über einzelne Städte (Städteseiten, Länderseiten) nachlesen und anpassen.

## Gesetze

Bei einer Gesetzesänderung `REGELN` in `regeln.ts`, Lesedatum in `params-2026.json` und die Tests in
`tests/engine.test.ts` anpassen. Länder ohne öffentliche Liste (Saarland) im Text so benennen.

## Regeln für Texte

Titel 50 bis 60 Zeichen, Beschreibung 150 bis 160, FAQ 3 bis 5 (Startseite 6 bis 8) mit 40 bis 90 Wörtern,
kein Geschäft beworben, kein Gedankenstrich, Zahlen und Daten aus Daten und Rechenkern, nie getippt.
