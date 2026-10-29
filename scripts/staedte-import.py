#!/usr/bin/env python3
"""Liest die Recherche (eine JSON-Datei je Stadt) und schreibt src/data/staedte.json.

Usage : python3 scripts/staedte-import.py <ordner> [--stand AAAA-MM-JJ]

Jede Datei folgt dem Schema id, name, land, termine[{datum, anlass, bereich, zeit, quelle}],
status2026, status2027, quellen[{titel, herausgeber, art, url, gelesen}], notiz.
Das Skript prüft: Datum im ISO-Format, Quelle vorhanden, Adresse https, Lesedatum gesetzt,
keine verbotene Quelle (Sammelseiten, Presse). Eine fehlerhafte Datei bricht den Lauf ab:
lieber keine Zeile als eine falsche.
Jährlich (Dezember bis Februar beschließen die Räte die Verordnungen) neu recherchieren und einlesen,
dann `npm run check`.
"""
import json, re, sys, os, glob, datetime

VERBOTEN = re.compile(r'verkaufsoffener-sonntag\.com|kaufsonntag\.de|opensunday\.de|oeffnungszeitenbuch|news\.de|'
                      r'wikipedia|waz\.de|express\.de|rp-online|tz\.de|merkur\.de|bild\.de|radio', re.I)
EN = {'Köln': 'Cologne', 'München': 'Munich', 'Nürnberg': 'Nuremberg', 'Hannover': 'Hanover',
      'Braunschweig': 'Brunswick', 'Frankfurt am Main': 'Frankfurt', 'Mönchengladbach': 'Mönchengladbach'}
LAENDER = {'BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'}


# Kein Geschäft wird beworben: Namen von Läden, Ketten und Einkaufszentren durch eine neutrale Angabe ersetzen.
MARKEN = [
    (r'\s*\(CITTI-PARK, IKEA, Sconto, Höffner\)', ' (Gewerbegebiete)'), (r'\s*\(Famila\)', ''),
    (r'Cannstatter Carré, ', ''), (r' inkl\. Durlach Center', ''),
    (r'Einkaufszentrum Westfield Centro, Centroallee', 'Einkaufszentrum an der Centroallee'),
    (r'Westfield Centro Familienfest', 'Familienfest'), (r'Westfield Centro Weihnachtsmärkte', 'Weihnachtsmärkte'),
    (r'designer outlets Wolfsburg \(DOW\)', 'Outlet-Center'),
    (r'Elbenwald-Festival', 'Fantasy-Festival'),
    (r'(Einkaufszentrum|Einkaufszentrums) Marler Stern', r'\1 in Marl-Mitte'),
]
def neutral(x):
    for pat, rep in MARKEN:
        x = re.sub(pat, rep, x)
    return x

src = sys.argv[1]
stand = sys.argv[sys.argv.index('--stand') + 1] if '--stand' in sys.argv else datetime.date.today().isoformat()
out, fehler = [], []
for f in sorted(glob.glob(os.path.join(src, '*.json'))):
    d = json.load(open(f, encoding='utf-8'))
    if 'id' not in d or 'termine' not in d:
        continue
    pf = os.path.basename(f)
    if d['land'] not in LAENDER:
        fehler.append(f'{pf}: Land {d["land"]}')
    q = d.get('quellen', [])
    for x in q:
        if not x.get('url', '').startswith('https://') and not x.get('url', '').startswith('http://'):
            fehler.append(f'{pf}: Adresse fehlt')
        if VERBOTEN.search(x.get('url', '')):
            fehler.append(f'{pf}: verbotene Quelle {x["url"]}')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', x.get('gelesen', '')):
            fehler.append(f'{pf}: Lesedatum fehlt')
    termine = []
    for t in d['termine']:
        if not re.fullmatch(r'20(26|27)-\d{2}-\d{2}', t.get('datum', '')):
            continue  # nur 2026 und 2027
        if not isinstance(t.get('quelle'), int) or t['quelle'] >= len(q):
            fehler.append(f'{pf}: Termin {t.get("datum")} ohne Quelle')
            continue
        row = {k: t.get(k) for k in ('datum', 'anlass', 'bereich', 'zeit', 'quelle')}
        for k in ('anlass', 'bereich'):
            if row[k]:
                row[k] = neutral(row[k])
        if t.get('eingeschraenkt'):
            row['eingeschraenkt'] = True
        termine.append(row)
    termine.sort(key=lambda t: (t['datum'], t['bereich'] or ''))
    row = {'id': d['id'], 'name': d['name'], 'land': d['land'], 'termine': termine,
           'status2026': d.get('status2026', 'nicht-gefunden'), 'status2027': d.get('status2027', 'nicht-veroeffentlicht'),
           'quellen': [{k: x.get(k) for k in ('titel', 'herausgeber', 'art', 'url', 'gelesen')} for x in q]}
    if d.get('notiz'):
        row['notiz'] = neutral(d['notiz'])
    if d['name'] in EN and EN[d['name']] != d['name']:
        row['en'] = EN[d['name']]
    out.append(row)
if fehler:
    print('\n'.join(fehler))
    sys.exit(1)
out.sort(key=lambda s: s['name'])
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data', 'staedte.json')
json.dump({'stand': stand, 'staedte': out}, open(dst, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
n = sum(len(s['termine']) for s in out)
print(f'{len(out)} Städte, {n} Termine → src/data/staedte.json')
