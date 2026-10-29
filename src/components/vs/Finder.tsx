/**
 * Termin-Finder: heute, dieses Wochenende, alle kommenden Termine oder ein ganzes Jahr, für ganz Deutschland,
 * ein Land oder eine Stadt. Rechnet mit dem Datum des Geräts; Suche, Auswahl und die .ics-Datei bleiben im Browser.
 * Erster Render = Tag des Builds (__BUILD_DAY__), das Datum des Geräts kommt nach dem Mounten (RECETTE §17.4).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Rows, ShareRow } from '../calc/parts';
import Countdown from './Countdown';
import { readParams, updateURL } from '../../lib/url-state';
import { STAEDTE, STAND, alleTermine, stadtById, stadtName, status, type Eintrag } from '../../lib/staedte';
import { REGELN } from '../../lib/engine/regeln';
import { LAENDER, LAND_NAME, fromIso, toIso, weekday, type Land } from '../../lib/engine/feiertage';
import { dShort, dLong } from '../../lib/tool-specs';
import { icsDatei, zeitspanne } from '../../lib/ics';
import { berlinInstant } from '../../lib/zeit';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

type Modus = 'heute' | 'wochenende' | 'ab' | '2026' | '2027';
interface Props { lang: Lang; land?: string; stadt?: string; modus?: Modus; methodHref?: string; idPrefix?: string }
const norm = (x: string) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, ' ').trim();
const KEYS = STAEDTE.map((s) => [norm(s.name), norm(s.en ?? '')]);
const lokal = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const MAX_ROWS = 60;

export default function Finder({ lang, land: land0 = '', stadt: stadt0 = '', modus: modus0 = 'ab', methodHref, idPrefix = 'f' }: Props) {
  const ui = t(lang), T = (de: string, en: string) => (lang === 'de' ? de : en);
  const nf = new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB');
  const s0 = stadtById(stadt0);
  const [heute, setHeute] = useState(__BUILD_DAY__);
  const [land, setLand] = useState<string>(s0?.land ?? land0);
  const [stadt, setStadt] = useState<string>(stadt0);
  const [q, setQ] = useState<string>(s0 ? stadtName(s0, lang) : '');
  const [modus, setModus] = useState<Modus>(modus0);
  useEffect(() => {
    setHeute(lokal());
    const u = readParams(window.location.search);
    const st = stadtById(u.get('stadt') ?? '');
    if (st) { setStadt(st.id); setLand(st.land); setQ(stadtName(st, lang)); }
    else if (LAENDER.includes(u.get('land') as Land)) setLand(u.get('land')!);
    const m = u.get('zeit'); if (m && ['heute', 'wochenende', 'ab', '2026', '2027'].includes(m)) setModus(m as Modus);
  }, []);
  useEffect(() => updateURL({ stadt, land: stadt ? undefined : land, zeit: modus }), [stadt, land, modus]);

  const st = stadtById(stadt);
  const hits = useMemo(() => {
    const k = norm(q); if (!k || (st && norm(stadtName(st, lang)) === k)) return [] as number[];
    const a: number[] = [], b: number[] = [];
    KEYS.forEach(([de, en], i) => { if (de.startsWith(k) || en.startsWith(k)) a.push(i); else if (de.includes(k) || en.includes(k)) b.push(i); });
    return [...a, ...b].slice(0, 8);
  }, [q, st, lang]);
  const pick = (id: string) => { const x = stadtById(id)!; setStadt(id); setLand(x.land); setQ(stadtName(x, lang)); };
  const onQ = (v: string) => { setQ(v.slice(0, 60)); if (!v.trim()) setStadt(''); };
  const onLand = (v: string) => { setLand(v); if (st && st.land !== v) { setStadt(''); setQ(''); } };

  const basis = useMemo(() => alleTermine((land || undefined) as Land | undefined).filter((e) => !stadt || e.stadt.id === stadt), [land, stadt]);
  const so = useMemo(() => { const d = fromIso(heute); return toIso(d + ((7 - weekday(d)) % 7)); }, [heute]);
  const sa = useMemo(() => { const d = fromIso(so) - 1; return toIso(Math.max(d, fromIso(heute))); }, [so, heute]);
  const kommend = useMemo(() => basis.filter((e) => e.datum >= heute), [basis, heute]);
  const auswahl: Eintrag[] = useMemo(() => modus === 'heute' ? basis.filter((e) => e.datum === heute)
    : modus === 'wochenende' ? basis.filter((e) => e.datum >= sa && e.datum <= so)
    : modus === 'ab' ? kommend : basis.filter((e) => e.datum.startsWith(modus)), [basis, kommend, modus, heute, sa, so]);
  const next = kommend[0];
  const nextDay = next ? kommend.filter((e) => e.datum === next.datum) : [];
  const tage = next ? Math.round(fromIso(next.datum) - fromIso(heute)) : 0;
  const wo = st ? stadtName(st, lang) : land ? LAND_NAME[land as Land][lang] : T('Deutschland', 'Germany');
  const staedteN = new Set(auswahl.map((e) => e.stadt.id)).size;
  const zeitraum = { heute: T(`heute, ${dShort(heute, lang)}`, `today, ${dShort(heute, lang)}`), wochenende: T(`Wochenende bis ${dShort(so, lang)}`, `weekend to ${dShort(so, lang)}`), ab: T(`ab ${dShort(heute, lang)}`, `from ${dShort(heute, lang)}`), '2026': '2026', '2027': '2027' }[modus];
  const jahrStatus = st && (modus === '2026' || modus === '2027') && status(st, Number(modus)) !== 'veroeffentlicht';
  const value = modus === 'heute' || modus === 'wochenende'
    ? (auswahl.length ? (st ? T('Ja, geöffnet', 'Yes, open') : T(`${nf.format(staedteN)} ${staedteN === 1 ? 'Stadt' : 'Städte'}`, `${nf.format(staedteN)} ${staedteN === 1 ? 'town' : 'towns'}`)) : T('Kein Termin', 'No date'))
    : next ? dShort(next.datum, lang) : T('noch nicht veröffentlicht', 'not yet published');
  const label = modus === 'heute' ? T(`${wo}: verkaufsoffen heute?`, `${wo}: shops open today?`)
    : modus === 'wochenende' ? T(`${wo}: verkaufsoffen dieses Wochenende?`, `${wo}: shops open this weekend?`)
    : T(`${wo}: nächster verkaufsoffener Termin`, `${wo}: next shopping Sunday`);
  const sub = next
    ? T(`${tage === 0 ? 'heute' : tage === 1 ? 'morgen' : `in ${nf.format(tage)} Tagen`}: ${nextDay.length > 1 && !st ? `${nf.format(nextDay.length)} Termine` : [next.stadt.name, next.bereich, next.zeit].filter(Boolean).join(', ')}`,
        `${tage === 0 ? 'today' : tage === 1 ? 'tomorrow' : `in ${nf.format(tage)} days`}: ${nextDay.length > 1 && !st ? `${nf.format(nextDay.length)} dates` : [stadtName(next.stadt, 'en'), next.bereich, next.zeit].filter(Boolean).join(', ')}`)
    : st ? (st.notiz ?? T('Die Stadt hat noch keinen weiteren Termin bekannt gemacht.', 'The town has not announced another date yet.')) : T('Keine weiteren amtlich bekannten Termine in unserer Liste.', 'No further officially published dates on our list.');
  const regel = land ? REGELN[land as Land] : null;
  const z = next ? zeitspanne(next.zeit) : null;
  const at = next ? berlinInstant(next.datum, z ? `${String(Math.floor(z[0] / 60)).padStart(2, '0')}:${String(z[0] % 60).padStart(2, '0')}` : '00:00') : '';

  const download = () => {
    const list = auswahl.length ? auswahl : kommend;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const blob = new Blob([icsDatei(list, lang, stamp, window.location.hostname || 'verkaufsoffen')], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `verkaufsoffen-${st ? st.id : land ? land.toLowerCase() : 'deutschland'}-${modus}.ics`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  const icsN = (auswahl.length ? auswahl : kommend).length;

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} role="search">
          <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <label htmlFor={`${idPrefix}-q`} className="mb-1 block text-sm font-medium text-navy-700">{T('Stadt suchen', 'Search a town')}</label>
            <input id={`${idPrefix}-q`} type="text" inputMode="search" enterKeyHint="search" autoComplete="off" value={q} onChange={(e) => onQ(e.target.value)} placeholder={T('z. B. Köln', 'e.g. Cologne')}
              className="w-full rounded-lg border border-navy-300 bg-white h-12 px-4 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
            <p className="mt-1 text-xs text-navy-600">{T(`${nf.format(STAEDTE.length)} Städte. Ihre Eingabe bleibt im Browser.`, `${nf.format(STAEDTE.length)} towns. What you type stays in your browser.`)}</p>
          </div>
          <SelectField id={`${idPrefix}-land`} label={T('Bundesland', 'State')} value={land} onChange={onLand} options={[{ value: '', label: T('Alle 16 Länder', 'All 16 states') }, ...LAENDER.map((c) => ({ value: c, label: LAND_NAME[c][lang] }))]} />
          {hits.length > 0 && (
            <ul className="sm:col-span-2 divide-y divide-navy-100 rounded-lg border border-navy-200 text-sm">
              {hits.map((i) => { const x = STAEDTE[i]; const n = x.termine.filter((e) => e.datum >= heute).length; return (
                <li key={x.id}><button type="button" onClick={() => pick(x.id)} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-navy-50">
                  <span><span className="font-medium text-navy-900">{stadtName(x, lang)}</span> <span className="text-navy-600">· {LAND_NAME[x.land][lang]}</span></span>
                  <span className="shrink-0 rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-800">{n ? T(`${nf.format(n)} kommend`, `${nf.format(n)} upcoming`) : T('nichts angekündigt', 'none announced')}</span>
                </button></li>); })}
            </ul>
          )}
          <SelectField id={`${idPrefix}-zeit`} label={T('Zeitraum', 'Period')} value={modus} onChange={(v) => setModus(v as Modus)}
            options={[{ value: 'heute', label: T('Heute', 'Today') }, { value: 'wochenende', label: T('Dieses Wochenende', 'This weekend') }, { value: 'ab', label: T('Alle kommenden Termine', 'All upcoming dates') }, { value: '2026', label: T('Ganzes Jahr 2026', 'Whole year 2026') }, { value: '2027', label: T('Ganzes Jahr 2027', 'Whole year 2027') }]} />
        </form>
        <ResultCard label={label} value={value} sub={sub}>
          <Rows rows={[
            [T(`Termine, ${zeitraum}`, `Dates, ${zeitraum}`), nf.format(auswahl.length)],
            [T('Städte mit Termin', 'Towns with a date'), nf.format(staedteN)],
            ...(regel ? [[T(`Höchstzahl in ${LAND_NAME[land as Land].de}`, `Maximum in ${LAND_NAME[land as Land].en}`), T(`${nf.format(regel.max)} je Jahr (${regel.gesetz})`, `${nf.format(regel.max)} a year (${regel.gesetz})`)] as [string, string]] : []),
            [T('Liste geprüft am', 'List checked on'), dLong(STAND, lang)],
          ]} />
          <button type="button" onClick={download} disabled={!icsN} className="mt-3 w-full rounded-lg bg-accent-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-800 disabled:opacity-50">{T(`Kalenderdatei (.ics) mit ${nf.format(icsN)} Terminen`, `Calendar file (.ics) with ${nf.format(icsN)} dates`)}</button>
          <p className="mt-1 text-xs text-navy-600">{T('Wird in Ihrem Browser erzeugt, nichts wird gesendet.', 'Built in your browser, nothing is sent.')}</p>
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
      {next && modus !== '2026' && modus !== '2027' && <div className="mt-4"><Countdown at={at} label={T(`${next.stadt.name}${next.bereich ? `, ${next.bereich}` : ''}`, `${stadtName(next.stadt, 'en')}${next.bereich ? `, ${next.bereich}` : ''}`)} dateText={dLong(next.datum, lang)} lang={lang} /></div>}
      {jahrStatus && <p className="mt-4 rounded-lg bg-navy-50 p-3 text-sm text-navy-800">{T(`${st!.name}: Für ${modus} ist noch keine Verordnung veröffentlicht.`, `${stadtName(st!, 'en')}: no ordinance published for ${modus} yet.`)}{st!.notiz ? ` ${st!.notiz}` : ''}</p>}
      {auswahl.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="mb-2 text-left text-sm text-navy-700">{T(`${wo}, ${zeitraum}: Termine mit Gebiet, Anlass und amtlicher Quelle`, `${wo}, ${zeitraum}: dates with area, occasion and official source`)}{auswahl.length > MAX_ROWS ? T(` (die ersten ${MAX_ROWS} von ${nf.format(auswahl.length)}; die .ics-Datei enthält alle)`, ` (first ${MAX_ROWS} of ${nf.format(auswahl.length)}; the .ics file has them all)`) : ''}</caption>
            <thead><tr>{[T('Datum', 'Date'), T('Stadt', 'Town'), T('Gebiet', 'Area'), T('Anlass', 'Occasion'), T('Uhrzeit', 'Hours'), T('Quelle', 'Source')].map((h) => <th key={h} scope="col" className="border-b border-navy-300 px-2 py-1.5 text-left font-semibold text-navy-900">{h}</th>)}</tr></thead>
            <tbody>{auswahl.slice(0, MAX_ROWS).map((e, i) => { const qu = e.stadt.quellen[e.quelle]; return (
              <tr key={`${e.datum}-${e.stadt.id}-${i}`}>
                <td className="tabular-nums whitespace-nowrap border-b border-navy-100 px-2 py-1.5 text-navy-800">{dShort(e.datum, lang)}</td>
                <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800">{stadtName(e.stadt, lang)}</td>
                <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800">{e.bereich ?? '–'}{e.eingeschraenkt ? T(' (nur bestimmte Waren)', ' (certain goods only)') : ''}</td>
                <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800">{e.anlass ?? '–'}</td>
                <td className="whitespace-nowrap border-b border-navy-100 px-2 py-1.5 text-navy-800">{e.zeit ?? '–'}</td>
                <td className="border-b border-navy-100 px-2 py-1.5"><a href={qu.url} target="_blank" rel="nofollow noopener noreferrer" className="text-accent-700 underline">{qu.herausgeber}</a></td>
              </tr>); })}</tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-navy-700">{modus === 'heute' && weekday(fromIso(heute)) !== 0 ? T(`Heute ist kein Sonntag. Nächster Sonntag: ${dShort(so, lang)}.`, `Today is not a Sunday. Next Sunday: ${dShort(so, lang)}.`) : T('Für diese Auswahl ist kein Termin amtlich bekannt gemacht. Wir tragen nur ein, was eine Stadt veröffentlicht hat.', 'No date has been officially published for this selection. We only list what a town has published.')}</p>
      )}
    </div>
  );
}
