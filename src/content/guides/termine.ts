/** Pages transversales : heute, 2026, 2027, Advent, toutes les villes, les 16 lois. Chiffres : moteur + data/staedte.json. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelleGesetze, tabelleAdvent, tabelleStaedte } from '../../lib/bausteine';
import { STADT_IDS } from '../../lib/planned';
import { formatNumber } from '../../lib/format';

const n = (x: number, l: 'de' | 'en') => formatNumber(x, 0, l);
const T26 = K.imJahr(K.alleTermine(), 2026), T27 = K.imJahr(K.alleTermine(), 2027);
const st27 = K.STAEDTE.filter((s) => s.status2027 === 'veroeffentlicht');
const adv26 = K.kirchentage(2026).advent, adv27 = K.kirchentage(2027).advent;
const proMonat = (list: typeof T26, y: number) => Array.from({ length: 12 }, (_, i) => list.filter((t) => t.datum.startsWith(`${y}-${String(i + 1).padStart(2, '0')}`)).length);
const top = (list: typeof T26) => { const m = new Map<string, number>(); list.forEach((t) => m.set(t.datum, (m.get(t.datum) ?? 0) + 1)); return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])); };
const MON = { de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
const monatsTabelle = (h: Parameters<NonNullable<Parameters<typeof defineGuide>[0]['de']['body']>>[0], list: typeof T26, y: number) => h.table([h.lang === 'de' ? 'Monat' : 'Month', h.lang === 'de' ? 'Termine' : 'Dates'], proMonat(list, y).map((c, i) => [MON[h.lang][i], c]), h.lang === 'de' ? `Verkaufsoffene Termine ${y} je Monat, alle Städte unserer Liste` : `Shopping dates ${y} per month, all towns on our list`, ['l', 'r']);
const busiest26 = top(T26)[0];

export default [
  defineGuide({
    id: 'heute', group: 'termine', order: 1, tool: 'finder', toolArg: { modus: 'heute' },
    related: ['termine-2026', 'advent', 'staedte', 'land-nw'], sources: ['lo-nw', 'lo-by', 'lo-be', 'gg-140'],
    de: {
      slug: 'verkaufsoffener-sonntag-heute', nav: 'Heute geöffnet', card: 'Welche Städte heute und am Wochenende öffnen',
      title: 'Verkaufsoffener Sonntag heute: wo die Geschäfte offen haben',
      description: 'Verkaufsoffener Sonntag heute und dieses Wochenende: Der Finder zeigt mit dem Datum Ihres Geräts, welche Städte offen haben, mit Uhrzeit und amtlicher Quelle.',
      h1: 'Verkaufsoffener Sonntag heute: welche Städte geöffnet haben',
      intro: 'Der Finder nimmt das heutige Datum Ihres Geräts und zeigt jede Stadt, die heute einen verkaufsoffenen Sonntag hat, mit Gebiet, Uhrzeit und Quelle.',
      resume: `Ob heute in Ihrer Stadt die Geschäfte offen haben, steht nicht im Gesetz, sondern in der Verordnung oder Allgemeinverfügung der Stadt. Das Landesrecht legt nur den Rahmen fest: wie viele Sonntage eine Gemeinde im Jahr freigeben darf, zu welchen Stunden und welche Tage ausgeschlossen sind. Der Finder oben nimmt deshalb das Datum Ihres Geräts und sucht in unserer Liste, welche der ${n(K.STAEDTE.length, 'de')} Städte für heute oder das kommende Wochenende einen Termin bekannt gemacht haben. Jede Zeile nennt das Gebiet, denn viele Großstädte geben nur einzelne Stadtteile frei, dazu die Uhrzeit und den Link zur amtlichen Quelle. Ist heute kein Sonntag, springt die Anzeige auf den nächsten. An einem gewöhnlichen Sonntag ist fast überall geschlossen; offen haben dann nur Bäckereien für einige Stunden, Tankstellen, Bahnhofs- und Flughafengeschäfte sowie Läden in anerkannten Ausflugs- und Bäderorten. Wer sicher gehen will, prüft kurz vorher die Seite seiner Stadt: Gerichte haben in den letzten Jahren immer wieder einzelne Sonntage kurzfristig gestoppt.`,
      faqs: [
        { q: 'Woher weiß der Finder, welcher Tag heute ist?', a: 'Er liest das Datum Ihres Geräts, nachdem die Seite geladen ist, und vergleicht es mit den Terminen in unserer Liste. Nichts davon verlässt Ihren Browser. Steht die Uhr Ihres Geräts falsch, zeigt der Finder den falschen Tag; der Zeitraum „Alle kommenden Termine“ listet dann trotzdem alle späteren Termine.' },
        { q: 'Warum steht meine Stadt heute nicht in der Liste?', a: 'Entweder hat sie für heute keinen Sonntag freigegeben, oder wir haben ihre Bekanntmachung noch nicht gefunden. Wir tragen nur Termine ein, die eine Stadt, ihr Stadtmarketing oder das Land amtlich veröffentlicht hat. Ein Hinweis in einer Zeitung oder auf einer Sammelseite genügt uns nicht, weil Termine kurzfristig abgesagt werden.' },
        { q: 'Was hat an einem normalen Sonntag geöffnet?', a: 'Nach den Ladenöffnungsgesetzen der Länder vor allem Bäckereien und Blumenläden für wenige Stunden, Tankstellen, Apotheken im Notdienst sowie Geschäfte in Bahnhöfen und Flughäfen. In anerkannten Kur-, Ausflugs- und Bäderorten dürfen Läden mit touristischem Angebot oft an vielen Sonntagen öffnen. Supermärkte und Kaufhäuser bleiben geschlossen.' },
      ],
      body: (h) => `<h2>Was „verkaufsoffen“ heute bedeutet</h2>
<p>Ein verkaufsoffener Sonntag ist eine Ausnahme vom Ladenschluss, die eine Stadt für einen bestimmten Tag, ein bestimmtes Gebiet und eine bestimmte Uhrzeit erlässt. Das Grundgesetz schützt den Sonntag als Tag der Arbeitsruhe (${h.src('gg-140', 'Art. 140 GG mit Art. 139 WRV')}), deshalb verlangen die Länder fast überall einen Anlass: ein Stadtfest, einen Markt, eine Messe. Ohne die Veranstaltung fällt auch die Öffnung weg. Sagt der Veranstalter das Fest ab, widerruft die Stadt oft auch den Sonntag, wie Stuttgart 2026 für zwei Bezirke.</p>
<h2>Heute, dieses Wochenende, alle kommenden Termine</h2>
<p>Die Auswahl „Zeitraum“ arbeitet mit Ihrem Datum: „Heute“ zeigt nur den heutigen Tag, „Dieses Wochenende“ den Samstag und Sonntag dieser Woche, „Alle kommenden Termine“ alles, was noch folgt. Mit der Kalenderdatei übernehmen Sie die Auswahl in Ihren Kalender; jeder Eintrag enthält die Quelle. Die Liste wird nicht im Hintergrund nachgeladen: Was Sie sehen, ist der Stand vom ${h.day(K.STAND)}.</p>
${h.mini('stadt', { p: ['stadt'], d: { stadt: 'essen', jahr: 2026 }, t: 'Alle Termine einer Stadt in einem Jahr', c: 'Zum Jahreskalender' })}
<p>Die Termine nach Land stehen auf den Seiten der Länder, etwa ${h.a('land-nw', 'Nordrhein-Westfalen')} mit den meisten Städten, ${h.a('land-be', 'Berlin')} mit den acht Sonntagen des Senats oder ${h.a('land-by', 'Bayern')} mit seinem neuen Gesetz.</p>`,
    },
    en: {
      slug: 'shopping-sunday-today', nav: 'Open today', card: 'Which towns open today and this weekend',
      title: 'Shopping Sunday today in Germany: where shops are open',
      description: 'Shopping Sunday today and this weekend in Germany: using your device’s date, the finder shows which towns have shops open, with hours and the official source.',
      h1: 'Shopping Sunday today: which German towns are open',
      intro: 'The finder takes today’s date from your device and shows every town holding a shopping Sunday today, with the area, the hours and the source.',
      resume: `Whether shops in your town are open today is not written in the law but in the town’s own ordinance or general order. State law only sets the frame: how many Sundays a municipality may release each year, at what hours, and which days are excluded. The finder above therefore takes your device’s date and searches our list for any of the ${n(K.STAEDTE.length, 'en')} towns that have published a date for today or the coming weekend. Each row names the area, because many large cities release only certain districts, plus the hours and a link to the official source. If today is not a Sunday, the display jumps to the next one. On an ordinary Sunday almost everything is closed; only bakeries for a few hours, petrol stations, shops in railway stations and airports, and shops in recognised resort towns are open. To be safe, check your town’s page shortly before: in recent years courts have repeatedly stopped individual Sundays at short notice.`,
      faqs: [
        { q: 'How does the finder know what day it is?', a: 'It reads your device’s date once the page has loaded and compares it with the dates on our list. None of this leaves your browser. If your device clock is wrong, the finder shows the wrong day; the “All upcoming dates” period still lists every later date regardless.' },
        { q: 'Why is my town not listed for today?', a: 'Either it has released no Sunday for today, or we have not yet found its notice. We list only dates that a town, its official marketing body or the state has published. A newspaper item or an aggregator site is not enough for us, because dates get cancelled at short notice.' },
        { q: 'What is open on an ordinary Sunday in Germany?', a: 'Under the state shop opening acts, mainly bakeries and florists for a few hours, petrol stations, pharmacies on emergency duty, and shops in railway stations and airports. In recognised spa, excursion and seaside resorts, shops with tourist goods may often open on many Sundays. Supermarkets and department stores stay closed.' },
      ],
      body: (h) => `<h2>What “shops open on Sunday” means</h2>
<p>A shopping Sunday is an exception to closing hours that a town issues for a specific day, area and time. The Basic Law protects Sunday as a day of rest (${h.src('gg-140', 'Art. 140 Basic Law with Art. 139 Weimar Constitution')}), so almost every state requires an occasion: a town festival, a market, a fair. Without the event the opening goes too. When an organiser cancels the festival, the town often withdraws the Sunday as well, as Stuttgart did for two districts in 2026.</p>
<h2>Today, this weekend, every upcoming date</h2>
<p>The “Period” menu works with your date: “Today” shows today only, “This weekend” this week’s Saturday and Sunday, “All upcoming dates” everything still to come. The calendar file takes your selection into your calendar; each entry carries its source. The list is not reloaded in the background: what you see is the state of ${h.day(K.STAND)}.</p>
${h.mini('stadt', { p: ['stadt'], d: { stadt: 'essen', jahr: 2026 }, t: 'Every date of one town in a year', c: 'Open the yearly calendar' })}
<p>Dates by state are on the state pages, such as ${h.a('land-nw', 'North Rhine-Westphalia')} with the most towns, ${h.a('land-be', 'Berlin')} with the Senate’s eight Sundays, or ${h.a('land-by', 'Bavaria')} with its new act.</p>`,
    },
  }),

  defineGuide({
    id: 'termine-2026', group: 'termine', order: 2, tool: 'finder', toolArg: { modus: '2026' },
    related: ['termine-2027', 'advent', 'heute', 'staedte'], sources: ['lo-nw', 'lo-be', 'lo-sn', 'lo-by'],
    de: {
      slug: 'verkaufsoffene-sonntage-2026', nav: 'Termine 2026', card: 'Alle bekannten Termine des Jahres, Monat für Monat',
      title: 'Verkaufsoffene Sonntage 2026: alle Termine nach Stadt',
      description: 'Verkaufsoffene Sonntage 2026 in Deutschland: alle amtlich bekannten Termine der Städte, Monat für Monat, mit Gebiet, Anlass, Uhrzeit, Quelle und Kalenderdatei.',
      h1: 'Verkaufsoffene Sonntage 2026: alle Termine',
      intro: 'Der Jahreskalender 2026 aller Städte unserer Liste: nach Land oder Stadt filtern und die Auswahl als Kalenderdatei mitnehmen.',
      resume: `Für 2026 stehen ${n(T26.length, 'de')} verkaufsoffene Termine in ${n(new Set(T26.map((t) => t.stadt.id)).size, 'de')} Städten in unserer Liste, jeder mit der Bekanntmachung der Stadt. Die meisten fallen in den Herbst und auf die Adventszeit, weil viele Städte ihre Sonntage an Herbstmärkte, Kirmes und Weihnachtsmärkte binden. Der Tag mit den meisten Einträgen ist der ${h0(busiest26?.[0])} mit ${n(busiest26?.[1] ?? 0, 'de')} Terminen. Wie viele Sonntage eine Stadt haben darf, hängt vom Land ab: drei in Baden-Württemberg, vier in den meisten Ländern, fünf in Brandenburg, sechs je Gemeinde in Niedersachsen und acht in Berlin und Nordrhein-Westfalen. Große Städte in Nordrhein-Westfalen oder Baden-Württemberg verteilen ihre Freigaben auf Stadtbezirke und kommen so auf deutlich mehr Einträge. Der 1. Advent ist 2026 der 29. November und darf deshalb auch in Bayern und Rheinland-Pfalz freigegeben werden, wo nur die Adventssonntage im Dezember gesperrt sind. Vergangene Termine bleiben zur Nachschau in der Liste.`,
      faqs: [
        { q: 'Wann sind 2026 die Adventssonntage?', a: `Der 1. Advent ist der ${'29. November'}, der 2. der 6. Dezember, der 3. der 13. Dezember und der 4. der 20. Dezember 2026. Heiligabend fällt auf einen Donnerstag. Ob einer dieser Sonntage verkaufsoffen sein darf, regelt jedes Land anders; Sachsen, Berlin und Sachsen-Anhalt lassen alle vier zu, Hessen und Hamburg keinen.` },
        { q: 'Welche Feiertage 2026 können verkaufsoffen sein?', a: 'Einige Länder erlauben neben Sonntagen auch Feiertage, etwa Bayern, Baden-Württemberg oder Brandenburg. 2026 fällt der 3. Oktober auf einen Samstag; Ingolstadt hat ihn zum Herbstvolksfest freigegeben. In Nordrhein-Westfalen sind dagegen der 1. Mai, der 3. Oktober und die Weihnachtstage ausgeschlossen.' },
        { q: 'Werden abgesagte Termine 2026 aus der Liste entfernt?', a: 'Ja, sobald die Stadt die Absage veröffentlicht. Köln hat den Innenstadt-Sonntag am 19. April 2026 per Dringlichkeitsentscheidung aufgehoben, Stuttgart zwei Bezirkstermine nach abgesagten Festen widerrufen; diese Tage stehen nicht mehr im Kalender. Gerichtliche Eilentscheidungen tragen wir nach, wenn die Stadt sie bekannt macht.' },
      ],
      body: (h) => `<h2>Termine 2026 nach Monat</h2>
${monatsTabelle(h, T26, 2026)}
<p>Im Frühjahr häufen sich die Termine um Ostern und im Mai, im Sommer werden sie seltener, ab September steigt die Zahl wieder. Viele Städte in Nordrhein-Westfalen legen je einen Sonntag in den Spätsommer und den Herbst, oft an Stadtteilfesten, und einen in den Advent. Wo eine Stadt 2026 überhaupt keinen Termin hatte, steht sie in der Liste mit dem Vermerk „keine Quelle“ oder „offen“.</p>
${h.mini('advent', { p: ['land'], d: { land: 'SN', jahr: 2026 }, t: 'Advent 2026: welche Sonntage sind in Ihrem Land möglich?', c: 'Zur Adventsübersicht' })}
<h2>Wer die Termine festlegt</h2>
<p>In den meisten Ländern beschließt der Rat oder die Ordnungsbehörde der Stadt eine Verordnung; in Hessen ist es eine Allgemeinverfügung, die drei Monate vorher erscheinen muss, in Berlin eine Allgemeinverfügung des Senats für die ganze Stadt. Im Saarland melden die Geschäfte ihre Sonntage selbst bei der Ortspolizeibehörde an. Die Regeln aller Länder stehen unter ${h.a('gesetze', 'Ladenöffnungsgesetze im Vergleich')}; die Termine des nächsten Jahres unter ${h.a('termine-2027', 'verkaufsoffene Sonntage 2027')}.</p>`,
    },
    en: {
      slug: 'shopping-sundays-2026', nav: 'Dates 2026', card: 'Every known date of the year, month by month',
      title: 'Shopping Sundays 2026 in Germany: every date by town',
      description: 'Shopping Sundays 2026 in Germany: every officially published town date, month by month, with area, occasion, hours and source, downloadable as a calendar file.',
      h1: 'Shopping Sundays 2026: every date',
      intro: 'The 2026 calendar of every town on our list: filter by state or town and take your selection with you as a calendar file.',
      resume: `For 2026 our list holds ${n(T26.length, 'en')} shopping dates in ${n(new Set(T26.map((t) => t.stadt.id)).size, 'en')} towns, each with the town’s own notice. Most fall in autumn and Advent, because many towns tie their Sundays to autumn markets, funfairs and Christmas markets. The busiest day is ${h1(busiest26?.[0])} with ${n(busiest26?.[1] ?? 0, 'en')} dates. How many Sundays a town may have depends on its state: three in Baden-Württemberg, four in most states, five in Brandenburg, six per town in Lower Saxony and eight in Berlin and North Rhine-Westphalia. Large cities in North Rhine-Westphalia or Baden-Württemberg spread their releases over districts and so reach far more entries. The first Advent Sunday in 2026 is 29 November, so it may be released even in Bavaria and Rhineland-Palatinate, where only the Advent Sundays in December are barred. Past dates stay on the list for reference.`,
      faqs: [
        { q: 'When are the Advent Sundays in 2026?', a: 'The first Advent Sunday is 29 November, the second 6 December, the third 13 December and the fourth 20 December 2026. Christmas Eve is a Thursday. Whether any of these Sundays may be a shopping Sunday is set differently by each state; Saxony, Berlin and Saxony-Anhalt allow all four, Hesse and Hamburg none.' },
        { q: 'Which holidays in 2026 can be shopping days?', a: 'Some states allow public holidays as well as Sundays, such as Bavaria, Baden-Württemberg or Brandenburg. In 2026, 3 October is a Saturday; Ingolstadt released it for its autumn fair. North Rhine-Westphalia, by contrast, excludes 1 May, 3 October and the Christmas holidays.' },
        { q: 'Are cancelled 2026 dates removed from the list?', a: 'Yes, as soon as the town publishes the cancellation. Cologne withdrew its city-centre Sunday of 19 April 2026 by urgent decision, and Stuttgart revoked two district dates after festivals were called off; those days are no longer in the calendar. We add urgent court rulings once the town announces them.' },
      ],
      body: (h) => `<h2>Dates in 2026 by month</h2>
${monatsTabelle(h, T26, 2026)}
<p>Dates cluster around Easter and in May, thin out in summer and rise again from September. Many towns in North Rhine-Westphalia place one Sunday in late summer and one in autumn, often at district festivals, and one in Advent. A town with no date at all in 2026 appears on the list marked “no source” or “pending”.</p>
${h.mini('advent', { p: ['land'], d: { land: 'SN', jahr: 2026 }, t: 'Advent 2026: which Sundays are possible in your state?', c: 'Open the Advent overview' })}
<h2>Who sets the dates</h2>
<p>In most states the town council or public order authority adopts an ordinance; in Hesse it is a general order that must appear three months ahead, in Berlin a general order of the Senate for the whole city. In Saarland shops register their Sundays with the local police authority themselves. Every state’s rules are under ${h.a('gesetze', 'shop opening acts compared')}; next year’s dates under ${h.a('termine-2027', 'shopping Sundays 2027')}.</p>`,
    },
  }),

  defineGuide({
    id: 'termine-2027', group: 'termine', order: 3, tool: 'finder', toolArg: { modus: '2027' },
    related: ['termine-2026', 'staedte', 'gesetze', 'advent'], sources: ['lo-he', 'lo-be', 'lo-by', 'lo-nw'],
    de: {
      slug: 'verkaufsoffene-sonntage-2027', nav: 'Termine 2027', card: 'Was schon beschlossen ist, und was noch fehlt',
      title: 'Verkaufsoffene Sonntage 2027: Termine, soweit beschlossen',
      description: 'Verkaufsoffene Sonntage 2027: die Termine, die Städte schon beschlossen haben, mit Quelle, und welche Städte noch nichts veröffentlicht haben. Als Kalender.',
      h1: 'Verkaufsoffene Sonntage 2027: was schon feststeht',
      intro: 'Der Kalender 2027: Termine, die Städte schon amtlich beschlossen haben. Wo noch nichts veröffentlicht ist, steht „noch nicht veröffentlicht“.',
      resume: `Ende Oktober 2026 haben erst ${n(st27.length, 'de')} der ${n(K.STAEDTE.length, 'de')} Städte unserer Liste ihre Sonntage für 2027 amtlich bekannt gemacht, zusammen ${n(T27.length, 'de')} Termine. Das ist normal: Die meisten Räte beschließen ihre Verordnung für das folgende Jahr zwischen November und Februar, Berlin veröffentlicht die Allgemeinverfügung für das erste Halbjahr bis Jahresende, Hessen muss drei Monate vor jedem Termin bekannt machen. Einige Städte haben dagegen Verordnungen über mehrere Jahre, so Bielefeld, Gütersloh, Neuss, Moers oder Paderborn; deren Termine 2027 stehen schon fest. Wir tragen für 2027 nur ein, was amtlich veröffentlicht ist, und schreiben sonst „noch nicht veröffentlicht“, statt Daten aus dem Vorjahr fortzuschreiben. Was 2027 rechtlich überhaupt möglich ist, steht dagegen schon fest: Ostersonntag ist der 28. März, Pfingstsonntag der 16. Mai, Volkstrauertag der 14. und Totensonntag der 21. November, der 1. Advent der 28. November. Diese Tage sind in fast allen Ländern gesperrt.`,
      faqs: [
        { q: 'Wann veröffentlichen die Städte die Termine für 2027?', a: 'Meist zwischen November 2026 und Februar 2027, wenn der Rat die Verordnung beschließt und sie im Amtsblatt erscheint. In Hessen muss jeder Termin spätestens drei Monate vorher bekannt sein, in Berlin soll die Allgemeinverfügung für das erste Halbjahr bis Ende 2026 vorliegen. Wir aktualisieren die Liste, sobald eine Stadt veröffentlicht.' },
        { q: 'Warum übernehmen Sie nicht einfach die Termine von 2026?', a: 'Weil eine Stadt jedes Jahr neu entscheiden muss und der Anlass, etwa ein Fest, wegfallen oder den Tag wechseln kann. Ein fortgeschriebenes Datum wäre geraten. Nur wenn eine Verordnung ausdrücklich mehrere Jahre umfasst, wie in Bielefeld oder Neuss, stehen Termine 2027 schon jetzt in der Liste.' },
        { q: 'Welche Sonntage sind 2027 überall gesperrt?', a: 'Ostersonntag, der 28. März, ist in allen Ländern außer Thüringen ausdrücklich ausgeschlossen, Pfingstsonntag, der 16. Mai, fast überall. Volkstrauertag am 14. und Totensonntag am 21. November sind in dreizehn Ländern gesperrt. Die vier Adventssonntage ab dem 28. November regelt jedes Land anders.' },
      ],
      body: (h) => `<h2>Städte mit Terminen 2027</h2>
${h.table([h.lang === 'de' ? 'Stadt' : 'Town', 'Land', h.lang === 'de' ? 'Termine 2027' : 'Dates 2027'], st27.map((s) => [K.stadtName(s, h.lang), s.land, s.termine.filter((t) => t.datum.startsWith('2027')).length]), 'Städte, deren Termine 2027 am Stichtag amtlich veröffentlicht waren', ['l', 'l', 'r'])}
<p>Verordnungen über mehrere Jahre sind die Ausnahme. Wo eine Stadt sie nutzt, hängt der Termin an einem festen Fest, etwa einem Stadtteilfest am gleichen Wochenende jedes Jahr. Ändert sich das Fest, muss die Stadt die Verordnung ändern; wir lesen deshalb auch mehrjährige Verordnungen bei jeder Aktualisierung neu.</p>
${h.mini('regel', { p: ['land', 'sonntag'], d: { land: 'NW', jahr: 2027 }, t: 'Ist ein Sonntag 2027 in Ihrem Land überhaupt möglich?', c: 'Zur vollständigen Prüfung' })}
<h2>Was 2027 schon feststeht</h2>
<p>Ostersonntag fällt 2027 auf den 28. März, so früh wie selten; Pfingstsonntag folgt am 16. Mai. Weil beide in fast allen Ländern gesperrt sind, rücken Frühjahrstermine oft auf die Sonntage davor oder danach. Der 3. Oktober ist 2027 ein Sonntag: Gesperrt ist er in Bremen, Hamburg, Mecklenburg-Vorpommern, Niedersachsen, Nordrhein-Westfalen, Rheinland-Pfalz und Sachsen; in den übrigen neun Ländern kann eine Stadt ihn freigeben. Einzelheiten je Land unter ${h.a('gesetze', 'Ladenöffnungsgesetze')}.</p>`,
    },
    en: {
      slug: 'shopping-sundays-2027', nav: 'Dates 2027', card: 'What is already decided, and what is missing',
      title: 'Shopping Sundays 2027 in Germany: dates decided so far',
      description: 'Shopping Sundays 2027 in Germany: the dates towns have already adopted, with their source, and the towns that have published nothing yet. With a calendar file.',
      h1: 'Shopping Sundays 2027: what is already settled',
      intro: 'The 2027 calendar: dates towns have already adopted officially. Where nothing is published yet, the list says “not yet published”.',
      resume: `At the end of October 2026 only ${n(st27.length, 'en')} of the ${n(K.STAEDTE.length, 'en')} towns on our list had officially published their Sundays for 2027, ${n(T27.length, 'en')} dates in all. That is normal: most councils adopt next year’s ordinance between November and February, Berlin publishes its general order for the first half-year by the end of the year, and Hesse must announce each date three months ahead. Some towns, however, have ordinances covering several years, such as Bielefeld, Gütersloh, Neuss, Moers or Paderborn; their 2027 dates are already fixed. For 2027 we list only what is officially published and otherwise write “not yet published” rather than rolling last year’s dates forward. What is legally possible in 2027 is already known: Easter Sunday is 28 March, Whit Sunday 16 May, Volkstrauertag 14 November, Totensonntag 21 November and the first Advent Sunday 28 November. These days are barred in almost every state.`,
      faqs: [
        { q: 'When will towns publish their dates for 2027?', a: 'Mostly between November 2026 and February 2027, when the council adopts the ordinance and it appears in the gazette. In Hesse each date must be known at least three months ahead; in Berlin the general order for the first half-year is due by the end of 2026. We update the list as soon as a town publishes.' },
        { q: 'Why not simply copy the 2026 dates?', a: 'Because a town must decide afresh each year, and the occasion, such as a festival, may disappear or move. A rolled-forward date would be a guess. Only where an ordinance expressly covers several years, as in Bielefeld or Neuss, are 2027 dates already on the list.' },
        { q: 'Which Sundays are barred everywhere in 2027?', a: 'Easter Sunday, 28 March, is expressly excluded in every state except Thuringia, and Whit Sunday, 16 May, almost everywhere. Volkstrauertag on 14 November and Totensonntag on 21 November are barred in thirteen states. Each state treats the four Advent Sundays from 28 November differently.' },
      ],
      body: (h) => `<h2>Towns with dates for 2027</h2>
${h.table(['Town', 'State', 'Dates 2027'], st27.map((s) => [K.stadtName(s, h.lang), s.land, s.termine.filter((t) => t.datum.startsWith('2027')).length]), 'Towns whose 2027 dates were officially published on the reference date', ['l', 'l', 'r'])}
<p>Ordinances spanning several years are the exception. Where a town uses one, the date is tied to a fixed event, such as a district festival on the same weekend every year. If the event changes, the town must amend the ordinance, so we re-read multi-year ordinances at every update.</p>
${h.mini('regel', { p: ['land', 'sonntag'], d: { land: 'NW', jahr: 2027 }, t: 'Is a 2027 Sunday possible at all in your state?', c: 'Run the full check' })}
<h2>What is already fixed for 2027</h2>
<p>Easter Sunday falls on 28 March 2027, unusually early; Whit Sunday follows on 16 May. Because both are barred in almost every state, spring dates often move to the Sundays before or after. 3 October 2027 is a Sunday: it is barred in Bremen, Hamburg, Mecklenburg-Western Pomerania, Lower Saxony, North Rhine-Westphalia, Rhineland-Palatinate and Saxony; in the other nine states a town may release it. Details by state under ${h.a('gesetze', 'shop opening acts')}.</p>`,
    },
  }),

  defineGuide({
    id: 'advent', group: 'termine', order: 4, tool: 'advent', toolArg: { land: 'NW', jahr: 2026 },
    countdown: { date: adv26[0], label: { de: '1. Advent 2026', en: 'First Advent Sunday 2026' } },
    related: ['termine-2026', 'land-sn', 'land-be', 'gesetze'], sources: ['lo-sn', 'lo-be', 'lo-nw', 'lo-th', 'lo-by', 'bverfg-2009'],
    de: {
      slug: 'verkaufsoffener-sonntag-advent', nav: 'Advent', card: 'Welche Adventssonntage in welchem Land möglich sind',
      title: 'Verkaufsoffener Sonntag im Advent 2026: Regeln je Bundesland',
      description: 'Verkaufsoffener Sonntag im Advent 2026: welche der vier Adventssonntage in Ihrem Bundesland freigegeben werden dürfen, und welche Städte es getan haben.',
      h1: 'Verkaufsoffener Sonntag im Advent 2026',
      intro: 'Land wählen: Das Werkzeug zeigt, welche der vier Adventssonntage das Landesgesetz zulässt und welche Städte sie schon freigegeben haben.',
      resume: `Der Advent ist die Zeit, in der sich die sechzehn Länder am deutlichsten unterscheiden. Sachsen, Berlin, Brandenburg und Sachsen-Anhalt lassen alle vier Adventssonntage zu, mit Grenzen: In Berlin ist Heiligabend an einem Sonntag gesperrt, in Brandenburg dürfen höchstens zwei Tage in vier Wochen liegen. Nordrhein-Westfalen erlaubt für das ganze Stadtgebiet nur einen Adventssonntag, Thüringen wahlweise den ersten oder zweiten. Bayern und Rheinland-Pfalz sperren nur die Adventssonntage im Dezember; 2026 fällt der 1. Advent auf den ${h0(adv26[0])} und ist dort deshalb möglich. Mecklenburg-Vorpommern und das Saarland lassen im Dezember nur den 1. Advent zu. Baden-Württemberg, Bremen, Hamburg, Hessen, Niedersachsen und Schleswig-Holstein sperren alle Adventssonntage. Dass die Adventszeit kein Freibrief ist, hat das Bundesverfassungsgericht 2009 entschieden, als es die Berliner Regel mit allen vier Adventssonntagen verwarf. Die Tabelle unten zeigt die Lage für 2026 Land für Land.`,
      faqs: [
        { q: 'In welchen Ländern sind alle vier Adventssonntage möglich?', a: 'In Sachsen, Berlin, Brandenburg und Sachsen-Anhalt sperrt das Landesgesetz keinen Adventssonntag. Grenzen gibt es trotzdem: Berlin schließt Heiligabend am Sonntag aus, Brandenburg erlaubt höchstens zwei Tage in vier Wochen, Sachsen höchstens zwei Sonntage in Folge. Ob eine Stadt die Möglichkeit nutzt, steht in ihrer Verordnung.' },
        { q: 'Ist der 4. Advent 2026 verkaufsoffen?', a: 'Der 4. Advent ist 2026 der 20. Dezember. Möglich ist er nur in Ländern, die Adventssonntage im Dezember nicht sperren: Sachsen, Berlin, Brandenburg, Sachsen-Anhalt und, als einziger Adventssonntag einer Stadt, Nordrhein-Westfalen. In Bayern, Hessen, Hamburg und den übrigen Ländern bleibt er geschlossen.' },
        { q: 'Was hat das Bundesverfassungsgericht zum Advent entschieden?', a: 'Am 1. Dezember 2009 erklärte es die Berliner Regel, die Geschäfte an allen vier Adventssonntagen öffnen ließ, für unvereinbar mit dem Sonntagsschutz des Grundgesetzes (1 BvR 2857/07). Die Sonntagsöffnung muss die Ausnahme bleiben. Seitdem geben auch Länder ohne ausdrückliches Verbot nicht mehr alle Adventssonntage frei.' },
      ],
      body: (h) => `<h2>Die vier Adventssonntage 2026 in allen Ländern</h2>
${tabelleAdvent(h, 2026)}
<p>„Ja, eingeschränkt“ bedeutet in Nordrhein-Westfalen, dass die ganze Stadt nur einen der vier Sonntage freigeben darf, und in Thüringen, dass nur der erste oder der zweite in Frage kommt. In Brandenburg und Sachsen begrenzen Abstandsregeln die Zahl, auch wenn jeder einzelne Sonntag erlaubt ist.</p>
<h2>2027: der 1. Advent im November</h2>
<p>2027 ist der 1. Advent der ${h.day(adv27[0])}, der 4. der ${h.day(adv27[3])}. Weil der 1. Advent wieder im November liegt, bleibt er in Bayern und Rheinland-Pfalz freigabefähig. Heiligabend fällt 2027 auf einen Freitag und spielt für die Sonntagsregeln keine Rolle.</p>
${tabelleAdvent(h, 2027)}
${h.mini('regel', { p: ['land'], d: { land: 'BY', jahr: 2026, sonntag: adv26[0] }, t: 'Einen Adventssonntag in Ihrem Land prüfen', c: 'Jeden Sonntag prüfen' })}
<p>Mehr zu den Ländern mit den meisten Adventsterminen: ${h.a('land-sn', 'Sachsen')} und ${h.a('land-be', 'Berlin')}. Das Urteil von 2009 im Wortlaut: ${h.src('bverfg-2009')}.</p>`,
    },
    en: {
      slug: 'shopping-sundays-advent', nav: 'Advent', card: 'Which Advent Sundays each state allows',
      title: 'Shopping Sundays in Advent 2026: the rules in every state',
      description: 'Shopping Sundays in Advent 2026 in Germany: which of the four Advent Sundays your state lets towns release, and which towns have actually released them.',
      h1: 'Shopping Sundays in Advent 2026',
      intro: 'Pick a state: the tool shows which of the four Advent Sundays the state act allows and which towns have released them already.',
      resume: `Advent is when the sixteen states differ most. Saxony, Berlin, Brandenburg and Saxony-Anhalt allow all four Advent Sundays, within limits: Berlin bars Christmas Eve on a Sunday, and Brandenburg allows no more than two days within four weeks. North Rhine-Westphalia allows only one Advent Sunday town-wide, Thuringia either the first or the second. Bavaria and Rhineland-Palatinate bar only the Advent Sundays in December; in 2026 the first Advent Sunday falls on ${h1(adv26[0])} and is therefore possible there. Mecklenburg-Western Pomerania and Saarland allow only the first Advent Sunday in December. Baden-Württemberg, Bremen, Hamburg, Hesse, Lower Saxony and Schleswig-Holstein bar every Advent Sunday. That Advent is no free pass was decided by the Federal Constitutional Court in 2009, when it struck down Berlin’s rule opening all four Advent Sundays. The table below shows the position for 2026 state by state.`,
      faqs: [
        { q: 'In which states are all four Advent Sundays possible?', a: 'In Saxony, Berlin, Brandenburg and Saxony-Anhalt the state act bars no Advent Sunday. There are still limits: Berlin excludes Christmas Eve on a Sunday, Brandenburg allows two days within four weeks at most, Saxony two Sundays in a row at most. Whether a town uses the option is in its ordinance.' },
        { q: 'Is the fourth Advent Sunday 2026 a shopping Sunday?', a: 'The fourth Advent Sunday in 2026 is 20 December. It is possible only in states that do not bar Advent Sundays in December: Saxony, Berlin, Brandenburg, Saxony-Anhalt and, as a town’s single Advent Sunday, North Rhine-Westphalia. In Bavaria, Hesse, Hamburg and the other states it stays closed.' },
        { q: 'What did the Federal Constitutional Court decide about Advent?', a: 'On 1 December 2009 it held that Berlin’s rule letting shops open on all four Advent Sundays was incompatible with the Basic Law’s protection of Sundays (1 BvR 2857/07). Sunday opening must remain the exception. Since then even states without an express ban no longer release every Advent Sunday.' },
      ],
      body: (h) => `<h2>The four Advent Sundays of 2026 in every state</h2>
${tabelleAdvent(h, 2026)}
<p>“Yes, limited” means in North Rhine-Westphalia that a whole town may release only one of the four Sundays, and in Thuringia that only the first or the second qualifies. In Brandenburg and Saxony spacing rules cap the number even though each single Sunday is allowed.</p>
<h2>2027: the first Advent Sunday in November</h2>
<p>In 2027 the first Advent Sunday is ${h.day(adv27[0])} and the fourth ${h.day(adv27[3])}. Because the first again falls in November, it remains releasable in Bavaria and Rhineland-Palatinate. Christmas Eve 2027 is a Friday and plays no part in the Sunday rules.</p>
${tabelleAdvent(h, 2027)}
${h.mini('regel', { p: ['land'], d: { land: 'BY', jahr: 2026, sonntag: adv26[0] }, t: 'Check an Advent Sunday in your state', c: 'Check any Sunday' })}
<p>More on the states with the most Advent dates: ${h.a('land-sn', 'Saxony')} and ${h.a('land-be', 'Berlin')}. The 2009 judgment in full: ${h.src('bverfg-2009')}.</p>`,
    },
  }),

  defineGuide({
    id: 'staedte', group: 'staedte', order: 50, tool: 'status', toolArg: { land: 'NW', jahr: 2027 },
    related: ['heute', 'termine-2027', 'land-nw', 'gesetze'], sources: ['lo-nw', 'lo-by', 'lo-bw', 'lo-ni'],
    de: {
      slug: 'staedte', nav: 'Alle Städte', card: 'Jede Stadt der Liste mit Stand 2026 und 2027',
      title: 'Verkaufsoffene Sonntage nach Stadt: Liste mit Stand 2027',
      description: 'Verkaufsoffene Sonntage nach Stadt: alle Städte unserer Liste mit der Zahl der amtlich bekannten Termine 2026 und 2027, und wo noch keine Verordnung vorliegt.',
      h1: 'Verkaufsoffene Sonntage nach Stadt',
      intro: 'Land wählen: Das Werkzeug zeigt, welche Städte ihre Termine 2027 schon veröffentlicht haben und wo die Verordnung noch fehlt.',
      resume: `Unsere Liste umfasst ${n(K.STAEDTE.length, 'de')} Städte aus allen Teilen Deutschlands, darunter die größten Städte und die Städte, nach denen am häufigsten gesucht wird. Für jede haben wir die Seite der Stadt, ihr Amtsblatt oder die Verordnung gelesen und jeden Termin mit Datum, Gebiet, Anlass, Uhrzeit und Quelle eingetragen. Wo wir keine amtliche Bekanntmachung gefunden haben, steht „keine Quelle“, auch wenn Zeitungen oder Sammelseiten einen Termin nennen: Solche Angaben sind oft veraltet oder betreffen einen inzwischen abgesagten Sonntag. „Offen“ bedeutet, dass die Stadt für das Jahr noch nichts veröffentlicht hat. Für ${n(st27.length, 'de')} Städte sind die Termine 2027 bereits bekannt. Städte mit eigener Seite sind in der Tabelle verlinkt; die übrigen finden Sie über die Suche im Termin-Finder der Startseite. Fehlt Ihre Stadt, schreiben Sie uns über die Kontaktseite den Link zur Verordnung, wir prüfen und ergänzen sie.`,
      faqs: [
        { q: 'Warum steht bei einer großen Stadt „keine Quelle“?', a: 'Weil wir für diese Stadt keine amtliche Bekanntmachung gefunden haben: keine Verordnung im Amtsblatt, keine Seite der Stadt und keine Mitteilung ihres Stadtmarketings. Manche Städte veröffentlichen ihre Sonntage nur in Pressemitteilungen, die nach kurzer Zeit verschwinden. Sobald eine amtliche Quelle auftaucht, tragen wir die Termine nach.' },
        { q: 'Wie oft wird die Städteliste geprüft?', a: 'Jede Stadt wird bei jeder Aktualisierung neu gelesen, vor allem zwischen November und Februar, wenn die Räte die Verordnungen für das neue Jahr beschließen. Das Datum der letzten Prüfung steht in jeder Zeile der Quelle. Absagen und Gerichtsentscheidungen tragen wir nach, sobald die Stadt sie bekannt macht.' },
        { q: 'Kann ich eine Stadt melden, die fehlt?', a: 'Ja, über die Kontaktseite. Am meisten hilft der Link zur Verordnung, zur Allgemeinverfügung oder zur Seite der Stadt. Wir nehmen eine Stadt erst auf, wenn wir die amtliche Quelle selbst gelesen haben; Termine aus Werbung oder Sammelseiten übernehmen wir nicht, auch wenn sie stimmen mögen.' },
      ],
      body: (h) => `<h2>Alle Städte der Liste</h2>
${tabelleStaedte(h, STADT_IDS)}
<p>Die Zahl in den Spalten 2026 und 2027 ist die Zahl der Einträge, nicht der Sonntage: Gibt eine Stadt denselben Sonntag für drei Stadtteile frei, sind das drei Einträge. So entsteht bei Essen, Köln oder Stuttgart eine hohe Zahl, obwohl jeder einzelne Stadtteil die Höchstzahl seines Landes einhält.</p>
${h.mini('stadt', { p: ['stadt', 'jahr'], d: { stadt: 'bielefeld', jahr: 2027 }, t: 'Die Termine einer Stadt ansehen', c: 'Zum Jahreskalender' })}`,
    },
    en: {
      slug: 'towns', nav: 'All towns', card: 'Every town on the list with its 2026 and 2027 status',
      title: 'Shopping Sundays by town in Germany: list and 2027 status',
      description: 'Shopping Sundays by town in Germany: every town on our list with the number of officially published dates for 2026 and 2027, and where no ordinance exists yet.',
      h1: 'Shopping Sundays by town',
      intro: 'Pick a state: the tool shows which towns have already published their 2027 dates and where the ordinance is still missing.',
      resume: `Our list covers ${n(K.STAEDTE.length, 'en')} towns from every part of Germany, including the largest cities and the towns people search for most. For each we read the town’s page, its gazette or the ordinance and entered every date with its area, occasion, hours and source. Where we found no official notice, the list says “no source”, even if newspapers or aggregator sites name a date: such claims are often out of date or refer to a Sunday that has since been cancelled. “Pending” means the town has published nothing for that year yet. For ${n(st27.length, 'en')} towns the 2027 dates are already known. Towns with their own page are linked in the table; the rest can be found with the search in the date finder on the home page. If your town is missing, send us the link to its ordinance through the contact page and we will check it and add it.`,
      faqs: [
        { q: 'Why does a large town show “no source”?', a: 'Because we found no official notice for it: no ordinance in the gazette, no page of the town and no statement from its marketing body. Some towns publish their Sundays only in press releases that vanish after a while. As soon as an official source appears, we add the dates.' },
        { q: 'How often is the town list checked?', a: 'Every town is re-read at each update, above all between November and February, when councils adopt the ordinances for the new year. The date of the last check appears with each source. We add cancellations and court decisions once the town announces them.' },
        { q: 'Can I report a missing town?', a: 'Yes, through the contact page. The link to the ordinance, the general order or the town’s page helps most. We add a town only once we have read the official source ourselves; we do not copy dates from advertising or aggregator sites, even if they may be right.' },
      ],
      body: (h) => `<h2>Every town on the list</h2>
${tabelleStaedte(h, STADT_IDS)}
<p>The figure in the 2026 and 2027 columns counts entries, not Sundays: a town releasing the same Sunday for three districts has three entries. That is why Essen, Cologne or Stuttgart show high numbers although each district stays within its state’s maximum.</p>
${h.mini('stadt', { p: ['stadt', 'jahr'], d: { stadt: 'bielefeld', jahr: 2027 }, t: 'See one town’s dates', c: 'Open the yearly calendar' })}`,
    },
  }),

  defineGuide({
    id: 'gesetze', group: 'regeln', order: 60, tool: 'vergleich', toolArg: { land: 'NW', land2: 'BY', jahr: 2027 },
    related: ['land-by', 'land-nw', 'advent', 'land-be'], sources: ['gg-140', 'bverfg-2009', 'lo-nw', 'lo-by', 'lo-be', 'lo-bw', 'lo-sn', 'lo-ni', 'ladschlg-14'],
    de: {
      slug: 'ladenoeffnungsgesetze', nav: 'Ladenöffnungsgesetze', card: 'Die 16 Landesregeln im Vergleich',
      title: 'Ladenöffnungsgesetze 2026: verkaufsoffene Sonntage je Land',
      description: 'Ladenöffnungsgesetze der 16 Länder 2026: wie viele verkaufsoffene Sonntage erlaubt sind, zu welchen Zeiten, welche Tage gesperrt sind. Zwei Länder vergleichen.',
      h1: 'Ladenöffnungsgesetze: verkaufsoffene Sonntage in allen 16 Ländern',
      intro: 'Zwei Länder wählen: Der Vergleich zeigt Höchstzahl, Uhrzeit, Adventsregel, Anlass und wer freigibt, nach dem Wortlaut der beiden Gesetze.',
      resume: `Seit der Föderalismusreform von 2006 regelt jedes Land den Ladenschluss selbst, und Bayern hat als letztes Land am 1. August 2025 das Ladenschlussgesetz des Bundes durch ein eigenes Gesetz ersetzt. Die Spannweite ist groß: Baden-Württemberg erlaubt drei verkaufsoffene Sonn- oder Feiertage im Jahr, die meisten Länder vier, Brandenburg fünf, Niedersachsen sechs je Gemeinde und Berlin und Nordrhein-Westfalen acht. Auch die Uhrzeiten unterscheiden sich: 12 bis 18 Uhr fest in Sachsen, 13 bis 20 Uhr in Berlin und Brandenburg, bis zu sechs Stunden mit Ende um 20 Uhr in Hessen und Thüringen, fünf Stunden bis 18 Uhr in vielen anderen. Gemeinsam ist allen der Schutz des Sonntags nach Art. 140 Grundgesetz: Fast überall braucht die Öffnung einen Anlass, Ostersonntag und Pfingstsonntag sind fast überall gesperrt, Volkstrauertag und Totensonntag in dreizehn Ländern. Wer entscheidet, ist ebenfalls verschieden: meist die Stadt, in Berlin der Senat, in Thüringen der Landkreis, im Saarland die Geschäfte selbst. Alle Texte haben wir am 29. Oktober 2026 in den Landesportalen gelesen.`,
      faqs: [
        { q: 'Welches Bundesland hat die meisten verkaufsoffenen Sonntage?', a: 'Berlin und Nordrhein-Westfalen mit je acht. In Nordrhein-Westfalen kann eine Großstadt durch Freigaben für einzelne Bezirke sogar bis zu sechzehn Tage erreichen, in Berlin kommen zwei Tage je Geschäft aus eigenem Anlass hinzu. Niedersachsen erlaubt sechs je Gemeinde, Brandenburg fünf. Am wenigsten sind es in Baden-Württemberg mit drei.' },
        { q: 'Warum braucht ein verkaufsoffener Sonntag einen Anlass?', a: 'Weil Art. 140 des Grundgesetzes mit Art. 139 der Weimarer Reichsverfassung den Sonntag als Tag der Arbeitsruhe schützt. Das Bundesverfassungsgericht hat 2009 betont, dass die Öffnung die Ausnahme bleiben muss und ein reines Umsatzinteresse nicht genügt. Die Länder verlangen deshalb ein Fest, einen Markt oder ein öffentliches Interesse.' },
        { q: 'Gilt das Ladenschlussgesetz des Bundes noch irgendwo?', a: 'Für die Sonntagsöffnung in keinem Land mehr. Bayern war das letzte Land, in dem es galt; seit dem 1. August 2025 hat es das Bayerische Ladenschlussgesetz ersetzt. Das Bundesgesetz steht zwar noch im Bundesgesetzblatt, die Länder haben es aber nach Art. 125a Grundgesetz durch eigene Gesetze abgelöst.' },
      ],
      body: (h) => `<h2>Die 16 Länder auf einen Blick</h2>
${tabelleGesetze(h, 2027)}
<p>Die Spalte „Mögliche Sonntage“ zählt die Sonntage des Jahres, die das Gesetz nicht ausdrücklich sperrt. Freigeben darf eine Stadt davon nur so viele, wie die Höchstzahl erlaubt, und nur mit dem verlangten Anlass. Länder, die auch Feiertage zulassen, können zusätzlich einen Feiertag unter der Woche wählen.</p>
<h2>Was überall gleich ist</h2>
<p>Kein Land erlaubt einen verkaufsoffenen Sonntag ohne Grenze. Die Öffnung soll außerhalb des Hauptgottesdienstes liegen, Beschäftigte haben Anspruch auf Ausgleich, und die Freigabe kann auf Stadtteile und Handelszweige beschränkt werden. Gerichte prüfen den Anlass genau: Steht das Einkaufen im Vordergrund und nicht das Fest, hält die Freigabe oft nicht. Grundlage dafür ist ${h.src('gg-140', 'Art. 140 GG')} und das ${h.src('bverfg-2009', 'Urteil des Bundesverfassungsgerichts von 2009')}.</p>
${h.mini('regel', { p: ['land', 'sonntag'], d: { land: 'HE', jahr: 2027 }, t: 'Einen Sonntag nach dem Gesetz eines Landes prüfen', c: 'Zur vollständigen Prüfung' })}
<h2>Bayern seit August 2025</h2>
<p>Bayern hatte bis Juli 2025 kein eigenes Ladenschlussgesetz; dort galt noch ${h.src('ladschlg-14', '§ 14 des Bundesgesetzes')}. Das neue Gesetz hält an vier Tagen fest, öffnet aber den 1. Advent im November und Feiertage wie den 3. Oktober und erlaubt acht verkaufsoffene Nächte an Werktagen. Mehr dazu auf der Seite ${h.a('land-by', 'Bayern')}.</p>`,
    },
    en: {
      slug: 'shop-opening-acts', nav: 'Shop opening acts', card: 'The 16 state rules side by side',
      title: 'Shop opening acts 2026: Sunday trading rules by state',
      description: 'The shop opening acts of the 16 German states in 2026: how many shopping Sundays are allowed, at what hours and which days are barred. Compare any two states.',
      h1: 'Shop opening acts: shopping Sundays in all 16 states',
      intro: 'Pick two states: the comparison shows the maximum, hours, Advent rule, occasion and who releases, according to the wording of both acts.',
      resume: `Since the federalism reform of 2006 each state regulates shop hours itself, and Bavaria was the last to replace the federal Shop Closing Act with its own act, on 1 August 2025. The range is wide: Baden-Württemberg allows three shopping Sundays or holidays a year, most states four, Brandenburg five, Lower Saxony six per town, and Berlin and North Rhine-Westphalia eight. Hours differ too: a fixed noon to 6 pm in Saxony, 1 pm to 8 pm in Berlin and Brandenburg, up to six hours ending at 8 pm in Hesse and Thuringia, five hours until 6 pm in many others. All share the protection of Sunday under Art. 140 of the Basic Law: almost everywhere the opening needs an occasion, Easter Sunday and Whit Sunday are barred almost everywhere, Volkstrauertag and Totensonntag in thirteen states. Who decides also varies: usually the town, in Berlin the Senate, in Thuringia the district, in Saarland the shops themselves. We read every text in the state portals on 29 October 2026.`,
      faqs: [
        { q: 'Which German state has the most shopping Sundays?', a: 'Berlin and North Rhine-Westphalia, with eight each. In North Rhine-Westphalia a large city can reach up to sixteen days through district releases; in Berlin each shop may add two days for its own occasion. Lower Saxony allows six per town, Brandenburg five. Baden-Württemberg has the fewest, with three.' },
        { q: 'Why does a shopping Sunday need an occasion?', a: 'Because Art. 140 of the Basic Law, with Art. 139 of the Weimar Constitution, protects Sunday as a day of rest. In 2009 the Federal Constitutional Court stressed that opening must remain the exception and that a mere interest in turnover is not enough. The states therefore require a festival, a market or a public interest.' },
        { q: 'Does the federal Shop Closing Act still apply anywhere?', a: 'Not for Sunday opening in any state. Bavaria was the last state where it applied; since 1 August 2025 the Bavarian Shop Closing Act has replaced it. The federal act is still on the statute book, but under Art. 125a of the Basic Law the states have superseded it with their own acts.' },
      ],
      body: (h) => `<h2>The 16 states at a glance</h2>
${tabelleGesetze(h, 2027)}
<p>The “possible Sundays” column counts the Sundays of the year the act does not expressly bar. A town may release only as many of them as the maximum allows, and only with the required occasion. States that also allow holidays can pick a weekday holiday as well.</p>
<h2>What is the same everywhere</h2>
<p>No state allows unlimited shopping Sundays. Opening should avoid the main church service, staff are entitled to time off in lieu, and a release can be limited to districts and trades. Courts scrutinise the occasion closely: where shopping rather than the festival comes first, the release often fails. The basis is ${h.src('gg-140', 'Art. 140 Basic Law')} and the ${h.src('bverfg-2009', 'Federal Constitutional Court judgment of 2009')}.</p>
${h.mini('regel', { p: ['land', 'sonntag'], d: { land: 'HE', jahr: 2027 }, t: 'Check a Sunday under one state’s act', c: 'Run the full check' })}
<h2>Bavaria since August 2025</h2>
<p>Until July 2025 Bavaria had no shop closing act of its own; ${h.src('ladschlg-14', 'section 14 of the federal act')} still applied there. The new act keeps four days but opens the first Advent Sunday in November and holidays such as 3 October, and allows eight late shopping nights on weekdays. More on the ${h.a('land-by', 'Bavaria')} page.</p>`,
    },
  }),
];

function h0(iso?: string) { return iso ? K.dLong(iso, 'de') : '–'; }
function h1(iso?: string) { return iso ? K.dLong(iso, 'en') : '–'; }
