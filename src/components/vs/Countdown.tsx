/**
 * Compte à rebours en direct (jours, heures, minutes, secondes) jusqu'à un instant fixé en heure allemande.
 * Premier rendu = jour du build (__BUILD_DAY__), identique serveur/navigateur (RECETTE §17.5) ; l'horloge de
 * l'appareil prend le relais après le montage. Rien n'est envoyé : le calcul se fait dans le navigateur.
 */
import { useEffect, useState } from 'react';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { at: string; label: string; dateText: string; lang: Lang }
const part = (ms: number) => { const s = Math.max(0, Math.floor(ms / 1000)); return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }; };

export default function Countdown({ at, label, dateText, lang }: Props) {
  const ui = t(lang);
  const target = Date.parse(at);
  const [now, setNow] = useState<number>(() => Date.parse(`${__BUILD_DAY__}T00:00:00Z`));
  const [tz, setTz] = useState('');
  useEffect(() => {
    setNow(Date.now());
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch { /* sans fuseau */ }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = target - now, p = part(left);
  const nf = new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB');
  const cell = (v: number, u: string) => <span className="inline-flex items-baseline gap-1"><span className="tabular-nums text-2xl font-bold text-navy-900">{nf.format(v)}</span><span className="text-sm text-navy-600">{u}</span></span>;
  return (
    <div data-chrome className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3">
      <p className="text-sm font-medium text-navy-700">{ui.countdownTo} {label}, {dateText}</p>
      {left > 0
        ? <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1" aria-live="off">{cell(p.d, ui.days)}{cell(p.h, ui.hours)}{cell(p.m, ui.minutes)}{cell(p.s, ui.seconds)}</p>
        : <p className="mt-1 text-sm text-navy-800">{ui.passed}</p>}
      {tz && <p className="mt-1 text-xs text-navy-600">{ui.tzNote} {tz}.</p>}
    </div>
  );
}
