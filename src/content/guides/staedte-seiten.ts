/** Pages par grande ville : le Termin-Finder sur la ville, les dates 2026/2027 de data/staedte.json avec leur source, la règle du Land. */
import { defineGuide, type FAQ, type Helpers, type GuideDef } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelleStadt } from '../../lib/bausteine';
import type { Land } from '../../lib/engine/feiertage';

interface Text { slug: string; card: string; title: string; description: string; h1: string; intro: string; resume: string; faqs: FAQ[]; text: (h: Helpers) => string }
const H = (h: Helpers, de: string, en: string) => (h.lang === 'de' ? de : en);
const S = (id: string) => K.stadtById(id)!;
const anz = (id: string, y: number) => S(id).termine.filter((t) => t.datum.startsWith(String(y))).length;

function stadt(id: string, order: number, related: string[], de: Text, en: Text): GuideDef {
  const s = S(id); const land = s.land as Land; const L = K.LAND_NAME[land];
  const body = (x: Text) => (h: Helpers) => `${x.text(h)}
<h2>${H(h, `Termine 2026 in ${s.name}`, `Dates in 2026 in ${K.stadtName(s, 'en')}`)}</h2>
${tabelleStadt(h, s, 2026)}
<h2>${H(h, `Termine 2027 in ${s.name}`, `Dates in 2027 in ${K.stadtName(s, 'en')}`)}</h2>
${tabelleStadt(h, s, 2027)}
${h.mini('regel', { p: ['sonntag'], d: { land, jahr: 2027 }, t: H(h, `Ist ein Sonntag 2027 in ${L.de} möglich?`, `Is a 2027 Sunday possible in ${L.en}?`), c: H(h, 'Jeden Sonntag prüfen', 'Check any Sunday') })}
<p>${H(h, `Die Regeln des Landes und die übrigen Städte: ${h.a(`land-${land.toLowerCase()}`, `verkaufsoffene Sonntage in ${L.de}`)}.`, `The state’s rules and its other towns: ${h.a(`land-${land.toLowerCase()}`, `shopping Sundays in ${L.en}`)}.`)}</p>`;
  return defineGuide({ id: `stadt-${id}`, group: 'staedte', order, tool: 'finder', toolArg: { stadt: id, modus: 'ab' }, related: [`land-${land.toLowerCase()}`, ...related], sources: [K.REGELN[land].quelle],
    de: { ...de, nav: s.name, body: body(de) }, en: { ...en, nav: K.stadtName(s, 'en'), body: body(en) } });
}

export default [
  stadt('koeln', 51, ['stadt-duesseldorf', 'heute', 'advent'], {
    slug: 'verkaufsoffener-sonntag-koeln', card: 'Viele Veedel, ein Adventssonntag in der Innenstadt',
    title: 'Verkaufsoffener Sonntag Köln 2026: Termine nach Stadtteil',
    description: 'Verkaufsoffener Sonntag in Köln 2026: alle vom Rat beschlossenen Termine nach Stadtteil, mit Anlass und Uhrzeit, und der Stand für 2027. Mit Kalenderdatei.',
    h1: 'Verkaufsoffener Sonntag in Köln',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Köln mit Stadtteil, Fest und Uhrzeit, nach dem Datum Ihres Geräts.',
    resume: `Köln verteilt seine verkaufsoffenen Sonntage fast vollständig auf die Veedel. Der Rat hat die Verordnung für 2026 am 5. Februar beschlossen; sie gibt Sonntage für Sülz-Klettenberg, Porz-Mitte, Lindenthal, Rodenkirchen, Deutz, Neuehrenfeld, das Severinsviertel, Rath-Heumar, Dellbrück und Braunsfeld frei, jeweils zu einem Stadtteilfest und von 13 bis 18 Uhr. Die Innenstadt hat 2026 nur noch einen Termin, den 2. Advent am 6. Dezember zu den Weihnachtsmärkten. Den zweiten Innenstadt-Sonntag am 19. April, zur Fitnessmesse FIBO, hat die Stadt per Dringlichkeitsentscheidung wieder aufgehoben, nachdem die Rechtsgrundlage entfallen war. Insgesamt stehen ${anz('koeln', 2026)} Einträge für 2026 in der Liste. Möglich ist das, weil das Ladenöffnungsgesetz in Nordrhein-Westfalen acht Tage je Freigabegebiet zählt und eine Stadt mit Bezirken bis zu sechzehn erreicht. Für 2027 hat Köln noch keine Verordnung veröffentlicht.`,
    faqs: [
      { q: 'Ist in der Kölner Innenstadt 2026 noch ein verkaufsoffener Sonntag?', a: 'Ja, am 6. Dezember 2026, dem 2. Advent, von 13 bis 18 Uhr zu den Weihnachtsmärkten. Der zweite geplante Innenstadt-Termin am 19. April ist entfallen: Die Stadt hat ihn per Dringlichkeitsentscheidung aus der Verordnung gestrichen. Alle anderen Kölner Termine 2026 betreffen einzelne Stadtteile.' },
      { q: 'Warum hat Köln so viele Termine in den Stadtteilen?', a: 'Das nordrhein-westfälische Gesetz erlaubt acht Sonntage je Freigabegebiet und bis zu sechzehn je Stadt, wenn die Freigaben auf Bezirke verteilt sind. Köln nutzt das für Veedelsfeste wie das Neuehrenfest oder den längsten Tisch im Severinsviertel. Geöffnet haben dann nur die Geschäfte im Umfeld des jeweiligen Festes.' },
      { q: 'Wann veröffentlicht Köln die Termine für 2027?', a: 'Die Verordnung für 2026 hat der Rat Anfang Februar beschlossen. Für 2027 ist ein ähnlicher Zeitplan zu erwarten, eine Veröffentlichung lag am 29. Oktober 2026 noch nicht vor. Sobald die Stadt sie bekannt macht, ergänzen wir die Termine hier. Bis dahin steht Köln für 2027 mit „noch nicht veröffentlicht“ in der Liste.' },
    ],
    text: (h) => `<h2>Wie Köln seine Sonntage vergibt</h2>
<p>Die Kölner Verordnung ist eine Liste von Stadtteilfesten. Jeder Eintrag nennt ein Fest, einen Tag und ein Gebiet, meist ein Geschäftsviertel rund um die Festmeile. Geöffnet haben dann die Geschäfte dieses Gebiets, nicht die ganze Stadt. Wer etwa am 18. Oktober zu „Kunst im Carrée“ nach Sülz-Klettenberg fährt, findet dort offene Läden, in Ehrenfeld oder der Schildergasse dagegen nicht. Lindenthal und Porz-Mitte haben 2026 je drei Termine, mehr als jeder andere Stadtteil.</p>
<p>Im Dezember gibt es zwei Kölner Termine: die Innenstadt am 2. Advent und Porz-Mitte am 3. Advent zum Adventsmarkt. Das Gesetz erlaubt in Nordrhein-Westfalen je Bezirk einen Adventssonntag, für die ganze Stadt zusammen höchstens zwei. Die Uhrzeit ist bei allen Kölner Terminen gleich: 13 bis 18 Uhr, die längste Dauer, die das Land zulässt.</p>`,
  }, {
    slug: 'shopping-sundays-cologne', card: 'Many districts, one Advent Sunday in the centre',
    title: 'Shopping Sundays Cologne 2026: every date by district',
    description: 'Shopping Sundays in Cologne 2026: every date adopted by the city council by district, with occasion and hours, and the position for 2027. With a calendar file.',
    h1: 'Shopping Sundays in Cologne',
    intro: 'The finder shows Cologne’s next released Sundays with district, festival and hours, based on your device’s date.',
    resume: `Cologne spreads its shopping Sundays almost entirely across its neighbourhoods. The council adopted the 2026 ordinance on 5 February; it releases Sundays for Sülz-Klettenberg, Porz-Mitte, Lindenthal, Rodenkirchen, Deutz, Neuehrenfeld, the Severinsviertel, Rath-Heumar, Dellbrück and Braunsfeld, each tied to a local festival and from 1 pm to 6 pm. The city centre has only one date left in 2026, the second Advent Sunday on 6 December for the Christmas markets. The second centre Sunday on 19 April, for the FIBO fitness fair, was withdrawn by urgent decision after its legal basis fell away. In all, the list holds ${anz('koeln', 2026)} entries for 2026. This is possible because North Rhine-Westphalia counts eight days per release area, and a city using districts can reach sixteen. Cologne has not yet published an ordinance for 2027.`,
    faqs: [
      { q: 'Is there still a shopping Sunday in Cologne city centre in 2026?', a: 'Yes, on 6 December 2026, the second Advent Sunday, from 1 pm to 6 pm for the Christmas markets. The second planned centre date on 19 April no longer applies: the city struck it from the ordinance by urgent decision. All other Cologne dates in 2026 cover single districts.' },
      { q: 'Why does Cologne have so many district dates?', a: 'North Rhine-Westphalia allows eight Sundays per release area and up to sixteen per town when releases are split across districts. Cologne uses this for neighbourhood festivals such as the Neuehrenfest or the longest table in the Severinsviertel. Only shops around the festival concerned open.' },
      { q: 'When will Cologne publish its 2027 dates?', a: 'The council adopted the 2026 ordinance in early February. A similar timetable is likely for 2027; nothing had been published by 29 October 2026. As soon as the city announces it, we will add the dates here. Until then Cologne appears for 2027 as “not yet published”.' },
    ],
    text: (h) => `<h2>How Cologne allocates its Sundays</h2>
<p>Cologne’s ordinance is a list of district festivals. Each entry names a festival, a day and an area, usually a shopping street around the festival mile. Shops in that area open, not the whole city. Anyone heading to “Kunst im Carrée” in Sülz-Klettenberg on 18 October will find open shops there, but not in Ehrenfeld or on the Schildergasse. Lindenthal and Porz-Mitte each have three dates in 2026, more than any other district.</p>
<p>There are two Cologne dates in December: the centre on the second Advent Sunday and Porz-Mitte on the third, for its Advent market. In North Rhine-Westphalia the act allows one Advent Sunday per district and two at most for the whole town. Hours are the same for every Cologne date: 1 pm to 6 pm, the longest the state permits.</p>`,
  }),

  stadt('muenchen', 52, ['stadt-nuernberg', 'land-by', 'gesetze'], {
    slug: 'verkaufsoffener-sonntag-muenchen', card: 'Kein allgemeiner Einkaufssonntag, nur Sondertage',
    title: 'Verkaufsoffener Sonntag München 2026: was wirklich offen ist',
    description: 'Verkaufsoffener Sonntag in München 2026 und 2027: warum es keinen allgemeinen Einkaufssonntag gibt, welche Sondertage gelten und welche Waren erlaubt sind.',
    h1: 'Verkaufsoffener Sonntag in München',
    intro: 'Der Finder zeigt die Sondertage der Münchner Verordnung mit Gebiet, Uhrzeit und erlaubtem Sortiment.',
    resume: `München hat keinen verkaufsoffenen Sonntag im üblichen Sinn, an dem alle Geschäfte einer Straße öffnen. Die Dauerverordnung der Landeshauptstadt erlaubt nur drei Sondertage mit begrenztem Sortiment: den Faschingssonntag im ganzen Stadtgebiet von 12 bis 17 Uhr, aber nur für Konditorei- und Süßwaren, Tabak, Scherzartikel, Papier und Schreibwaren; den ersten Oktoberfestsonntag in den Bezirken rund um die Wiesn von 11 bis 16 Uhr für Lebens- und Genussmittel, Tabak, Schreibwaren und Reiseandenken; und den 3. Oktober mit demselben Sortiment, wenn er nicht auf einen Samstag fällt. 2026 war das der Fall, 2027 ist der 3. Oktober ein Sonntag und damit ein Sondertag. Dazu dürfen Geschäfte mit Touristenbedarf in den Fußgängerbereichen der Altstadt von April bis Mitte Oktober und an den Adventssonntagen öffnen. Ein Modegeschäft oder ein Kaufhaus öffnet in München an keinem dieser Tage.`,
    faqs: [
      { q: 'Gibt es in München verkaufsoffene Sonntage?', a: 'Nicht für alle Geschäfte. Die Münchner Verordnung kennt nur den Faschingssonntag, den ersten Oktoberfestsonntag und den 3. Oktober, jeweils mit einem engen Sortiment wie Süßwaren, Lebensmittel, Tabak oder Reiseandenken. Kaufhäuser und Modegeschäfte bleiben geschlossen. Das neue bayerische Gesetz würde vier Tage erlauben; München nutzt diese Möglichkeit bisher nicht.' },
      { q: 'Haben Geschäfte am Oktoberfestsonntag offen?', a: 'Nur teilweise. Am ersten Oktoberfestsonntag dürfen in Altstadt-Lehel, der Ludwigs- und Isarvorstadt, der Maxvorstadt, Sendling und der Schwanthalerhöhe Geschäfte von 11 bis 16 Uhr öffnen, aber nur für Lebens- und Genussmittel, Tabakwaren, Schreibwaren und Reiseandenken. 2027 ist das der 19. September.' },
      { q: 'Was ist mit den Adventssonntagen in München?', a: 'Eine Freigabe nach Art. 6 gibt es nicht. Die Verordnung erlaubt aber Geschäften mit Touristenbedarf in den Fußgängerbereichen der Altstadt, an den vier Adventssonntagen von 11 bis 19 Uhr zu öffnen, ebenso an Sonn- und Feiertagen vom 1. April bis 15. Oktober. Andere Geschäfte haben dann geschlossen.' },
    ],
    text: (h) => `<h2>Warum München anders ist</h2>
<p>Die meisten bayerischen Städte geben ihre Sonntage zu Märkten oder Festen frei, so ${h.a('stadt-nuernberg', 'Nürnberg')} oder ${h.a('stadt-landshut', 'Landshut')}. München hat sich für eine dauerhafte Verordnung entschieden, die nicht an einzelne Feste anknüpft, sondern an Tage mit vielen Besuchern, und dafür das Sortiment eng hält. So bleibt der Sonntag für den Einzelhandel insgesamt geschlossen, während Besucher an diesen Tagen Getränke, Proviant und Andenken kaufen können.</p>
<p>Für die Jahre 2026 und 2027 ergeben sich daraus wenige Termine: der Faschingssonntag am 15. Februar 2026 und am 7. Februar 2027, der erste Oktoberfestsonntag am 20. September 2026 und am 19. September 2027, und 2027 zusätzlich der 3. Oktober. Die Daten haben wir aus den Regeln der Verordnung berechnet. Die verkaufsoffenen Nächte, die das neue Landesgesetz erlaubt, sind keine Sonntage und stehen deshalb nicht in dieser Liste.</p>`,
  }, {
    slug: 'shopping-sundays-munich', card: 'No general shopping Sunday, only special days',
    title: 'Shopping Sundays Munich 2026: what is really open on Sunday',
    description: 'Shopping Sundays in Munich 2026 and 2027: why there is no general shopping Sunday, which special days the ordinance allows and which goods may be sold on them.',
    h1: 'Shopping Sundays in Munich',
    intro: 'The finder shows the special days of Munich’s ordinance with area, hours and the goods allowed.',
    resume: `Munich has no shopping Sunday in the usual sense, when every shop on a street opens. The city’s standing ordinance allows only three special days with a restricted range of goods: Carnival Sunday across the whole city from noon to 5 pm, but only for pastries and sweets, tobacco, novelty items, paper and stationery; the first Oktoberfest Sunday in the districts around the fairground from 11 am to 4 pm for food and drink, tobacco, stationery and souvenirs; and 3 October with the same range when it does not fall on a Saturday. In 2026 it did; in 2027, 3 October is a Sunday and therefore a special day. In addition, shops selling tourist goods in the old town’s pedestrian zones may open from April to mid-October and on the Advent Sundays. A fashion store or department store opens on none of these days.`,
    faqs: [
      { q: 'Does Munich have shopping Sundays?', a: 'Not for all shops. Munich’s ordinance covers only Carnival Sunday, the first Oktoberfest Sunday and 3 October, each with a narrow range such as sweets, food, tobacco or souvenirs. Department stores and fashion shops stay closed. The new Bavarian act would allow four days; Munich has not used that option so far.' },
      { q: 'Are shops open on the first Oktoberfest Sunday?', a: 'Partly. On the first Oktoberfest Sunday shops in Altstadt-Lehel, Ludwigsvorstadt-Isarvorstadt, Maxvorstadt, Sendling and Schwanthalerhöhe may open from 11 am to 4 pm, but only for food and drink, tobacco, stationery and souvenirs. In 2027 that is 19 September. Other shops stay closed.' },
      { q: 'What about the Advent Sundays in Munich?', a: 'There is no release under Article 6. The ordinance does, however, let shops selling tourist goods in the old town’s pedestrian zones open on the four Advent Sundays from 11 am to 7 pm, and on Sundays and holidays from 1 April to 15 October. Other shops stay closed.' },
    ],
    text: (h) => `<h2>Why Munich is different</h2>
<p>Most Bavarian towns release their Sundays for markets or festivals, such as ${h.a('stadt-nuernberg', 'Nuremberg')} or ${h.a('stadt-landshut', 'Landshut')}. Munich chose a standing ordinance that is not tied to individual festivals but to days with many visitors, and keeps the range of goods tight in return. Retail as a whole therefore stays closed on Sundays, while visitors can buy drinks, provisions and souvenirs on those days.</p>
<p>For 2026 and 2027 this yields few dates: Carnival Sunday on 15 February 2026 and 7 February 2027, the first Oktoberfest Sunday on 20 September 2026 and 19 September 2027, and 3 October in 2027 as well. We computed the dates from the ordinance’s rules. The late shopping nights allowed by the new state act are not Sundays and so are not on this list.</p>`,
  }),

  stadt('duesseldorf', 53, ['stadt-koeln', 'land-nw', 'stadt-duisburg'], {
    slug: 'verkaufsoffener-sonntag-duesseldorf', card: 'Innenstadt zur Messe und zum Weihnachtsmarkt',
    title: 'Verkaufsoffener Sonntag Düsseldorf 2026: Termine und Gebiete',
    description: 'Verkaufsoffener Sonntag in Düsseldorf 2026: Termine des Ordnungsamts für Innenstadt, Benrath, Eller, Kaiserswerth, Oberkassel und Pempelfort, mit Anlass.',
    h1: 'Verkaufsoffener Sonntag in Düsseldorf',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Düsseldorf mit Stadtteil und Anlass, nach dem Datum Ihres Geräts.',
    resume: `Düsseldorf hat seine verkaufsoffenen Sonntage für 2026 am 10. Januar im Amtsblatt bekannt gemacht, als ordnungsbehördliche Verordnungen des Ordnungsamts. Die Innenstadt mit Stadtmitte, Altstadt und Carlstadt öffnet zweimal: am 10. Mai zur Verpackungsmesse Interpack und am 29. November, dem 1. Advent, zum Weihnachtsmarkt. Die übrigen Termine gehören den Stadtteilen: Eller zum Ostermarkt und zum Gumbertstraßenfest, Benrath zum Maimarkt, Oberkassel zum Luegalleefest, Kaiserswerth zum Kaiser- und Kartoffelfest, Pempelfort zum Nordstraßenfest. Am 2. Advent, dem 6. Dezember, öffnen Benrath, Eller, Kaiserswerth, Oberkassel und Pempelfort gemeinsam zu ihren Weihnachtsmärkten. Alle Termine laufen von 13 bis 18 Uhr. Zusammen sind das ${anz('duesseldorf', 2026)} Einträge. Für 2027 lag am 29. Oktober 2026 noch keine Verordnung vor; die Termine 2026 wurden im Januar veröffentlicht. Wer an einem dieser Sonntage in die Stadt fährt, sollte das Gebiet kennen: Geöffnet haben nur die Geschäfte in den Straßen, die der Lageplan des jeweiligen Termins zeigt, die übrige Stadt bleibt geschlossen.`,
    faqs: [
      { q: 'Wann ist in der Düsseldorfer Innenstadt verkaufsoffen?', a: 'Im Jahr 2026 zweimal: am 10. Mai zur Messe Interpack und am 29. November, dem 1. Advent, zum Weihnachtsmarkt, jeweils von 13 bis 18 Uhr in Stadtmitte, Altstadt und Carlstadt. Die übrigen Düsseldorfer Termine betreffen nur einzelne Stadtteile wie Benrath oder Kaiserswerth.' },
      { q: 'Ist am 2. Advent in Düsseldorf verkaufsoffen?', a: 'Ja, aber nicht in der Innenstadt. Am 6. Dezember 2026 öffnen Benrath, Eller, Kaiserswerth, Oberkassel und Pempelfort zu ihren örtlichen Weihnachtsmärkten von 13 bis 18 Uhr. Die Innenstadt hat ihren Adventssonntag schon am 29. November. Die genauen Straßen zeigt der Lageplan des Ordnungsamts.' },
      { q: 'Wo veröffentlicht Düsseldorf die Termine?', a: 'Im Düsseldorfer Amtsblatt als ordnungsbehördliche Verordnung und auf der Seite des Ordnungsamts mit einem Lageplan je Gebiet. Die Termine 2026 erschienen am 10. Januar. Die Lagepläne zeigen, welche Straßen genau zum freigegebenen Gebiet gehören. Für 2027 lag am 29. Oktober 2026 noch keine Bekanntmachung vor.' },
    ],
    text: (h) => `<h2>Messe, Märkte und Weihnachten</h2>
<p>Düsseldorf ist eine der wenigen Städte, die einen Sonntag an eine Fachmesse binden: Die Interpack zieht Besucher aus aller Welt an, und die Stadt hält das für einen Anlass, der die Öffnung der Innenstadt trägt. Die übrigen Termine folgen dem üblichen Muster in Nordrhein-Westfalen: ein Stadtteilfest, ein abgegrenztes Gebiet, fünf Stunden am Nachmittag.</p>
<p>Weil das Landesgesetz für eine Stadt mit Bezirksfreigaben zwei Adventssonntage erlaubt, verteilt Düsseldorf sie: der 1. Advent für die Innenstadt, der 2. für die fünf Stadtteile. Wer die genauen Straßen wissen will, findet sie im Lageplan des Ordnungsamts, den die Quelle in der Tabelle verlinkt. Mehr zum Nachbarn: ${h.a('stadt-koeln', 'Köln')}.</p>`,
  }, {
    slug: 'shopping-sundays-duesseldorf', card: 'City centre for the trade fair and Christmas market',
    title: 'Shopping Sundays Düsseldorf 2026: dates and shopping areas',
    description: 'Shopping Sundays in Düsseldorf 2026: the public order office’s dates for the centre, Benrath, Eller, Kaiserswerth, Oberkassel and Pempelfort, with hours.',
    h1: 'Shopping Sundays in Düsseldorf',
    intro: 'The finder shows Düsseldorf’s next released Sundays with district and occasion, based on your device’s date.',
    resume: `Düsseldorf published its 2026 shopping Sundays in the official gazette on 10 January, as ordinances of the public order office. The centre, covering Stadtmitte, Altstadt and Carlstadt, opens twice: on 10 May for the Interpack packaging fair and on 29 November, the first Advent Sunday, for the Christmas market. The other dates belong to districts: Eller for its Easter market and the Gumbertstraße festival, Benrath for its May market, Oberkassel for the Luegallee festival, Kaiserswerth for its emperor and potato festival, Pempelfort for the Nordstraße festival. On the second Advent Sunday, 6 December, Benrath, Eller, Kaiserswerth, Oberkassel and Pempelfort open together for their Christmas markets. Every date runs from 1 pm to 6 pm, ${anz('duesseldorf', 2026)} entries in all. No ordinance for 2027 had appeared by 29 October 2026; the 2026 dates were published in January.`,
    faqs: [
      { q: 'When are shops open on Sunday in Düsseldorf city centre?', a: 'Twice in 2026: on 10 May for the Interpack fair and on 29 November, the first Advent Sunday, for the Christmas market, each from 1 pm to 6 pm in Stadtmitte, Altstadt and Carlstadt. The other Düsseldorf dates cover only single districts such as Benrath or Kaiserswerth.' },
      { q: 'Are shops open in Düsseldorf on the second Advent Sunday?', a: 'Yes, but not in the centre. On 6 December 2026 Benrath, Eller, Kaiserswerth, Oberkassel and Pempelfort open for their local Christmas markets from 1 pm to 6 pm. The centre has its Advent Sunday on 29 November. The public order office’s site plan shows the exact streets.' },
      { q: 'Where does Düsseldorf publish the dates?', a: 'In the Düsseldorf official gazette as public order ordinances, and on the public order office’s page with a site plan for each area. The 2026 dates appeared on 10 January. The plans show exactly which streets belong to the released area.' },
    ],
    text: (h) => `<h2>Trade fair, markets and Christmas</h2>
<p>Düsseldorf is one of the few cities to tie a Sunday to a trade fair: Interpack draws visitors from around the world, and the city considers that an occasion able to carry a centre opening. The other dates follow the usual North Rhine-Westphalian pattern: a district festival, a defined area, five hours in the afternoon.</p>
<p>Because the state act allows a town with district releases two Advent Sundays, Düsseldorf splits them: the first Advent Sunday for the centre, the second for the five districts. For the exact streets, see the public order office’s site plan, linked as the source in the table. More on the neighbour: ${h.a('stadt-koeln', 'Cologne')}.</p>`,
  }),

  stadt('dortmund', 54, ['stadt-essen', 'land-nw', 'stadt-bielefeld'], {
    slug: 'verkaufsoffener-sonntag-dortmund', card: 'Eine Verordnung je Termin, City und Bezirke',
    title: 'Verkaufsoffener Sonntag Dortmund 2026: alle Termine',
    description: 'Verkaufsoffener Sonntag in Dortmund 2026: alle Termine aus dem Amtsblatt für City, Hörde, Aplerbeck, Hombruch und Lütgendortmund, mit Anlass und Uhrzeit.',
    h1: 'Verkaufsoffener Sonntag in Dortmund',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Dortmund mit Bezirk und Anlass, nach dem Datum Ihres Geräts.',
    resume: `Dortmund erlässt für jeden verkaufsoffenen Sonntag eine eigene ordnungsbehördliche Verordnung und veröffentlicht sie im Amtsblatt, oft nur wenige Wochen vor dem Termin. Für 2026 haben wir die Ausgaben 1 bis 42 durchgesehen und ${anz('dortmund', 2026)} Termine gefunden: die City innerhalb des Wallrings am 19. April zum E-Bike-Festival und am 8. November zum Hansemarkt, Hörde zum Hörder Frühling und zum Entenmarkt, Aplerbeck zum Künstlermarkt, Hombruch zu Straßenfest, Radrennen und Tag der Vereine, Lütgendortmund zum Martinsmarkt. Alle Termine laufen von 13 bis 18 Uhr. Die Stadt hatte im September 2025 weitere Sonntage angekündigt, darunter einen Weihnachtsmarkt-Sonntag in der City am 6. Dezember. Eine Verordnung dafür stand am 29. Oktober 2026 noch aus; ohne sie tragen wir den Termin nicht ein. Für 2027 ist noch nichts veröffentlicht.`,
    faqs: [
      { q: 'Gibt es 2026 einen verkaufsoffenen Sonntag zum Dortmunder Weihnachtsmarkt?', a: 'Angekündigt ist er für den 6. Dezember, eine Verordnung lag am 29. Oktober 2026 aber noch nicht vor. Dortmund macht jeden Termin einzeln im Amtsblatt bekannt, oft kurz vorher. Wir tragen den Sonntag ein, sobald die Verordnung erscheint; bis dahin steht er nicht im Kalender.' },
      { q: 'Wann ist in der Dortmunder City verkaufsoffen?', a: 'Im Jahr 2026 am 19. April zum E-Bike-Festival und am 8. November zum Hansemarkt, jeweils von 13 bis 18 Uhr innerhalb des Wallrings. Die übrigen Termine betreffen Hörde, Aplerbeck, Hombruch und Lütgendortmund. Ein dritter Termin zum Weihnachtsmarkt ist angekündigt, aber noch nicht bekannt gemacht.' },
      { q: 'Warum stehen manche angekündigte Dortmunder Termine nicht in der Liste?', a: 'Weil die Ankündigung der Stadt vom September 2025 nur eine Planung war. Rechtlich zählt die Verordnung im Amtsblatt. Für den 30. August in Lütgendortmund und den 6. September in Aplerbeck, Mengede und Hombruch haben wir keine gefunden. Sobald eine Verordnung erscheint, tragen wir den Termin nach.' },
    ],
    text: (h) => `<h2>Eine Verordnung für jeden Sonntag</h2>
<p>Andere Städte beschließen ihre Sonntage für das ganze Jahr in einem Zug. Dortmund geht Termin für Termin vor: Jede Freigabe hat eine eigene Verordnung mit eigener Begründung. Das macht die einzelne Freigabe gerichtsfester, weil die Stadt den Anlass zeitnah beschreiben kann, bedeutet aber auch, dass der Kalender lange unvollständig bleibt. Ein Termin, der im Frühjahr angekündigt wurde, kann bis zuletzt fehlen.</p>
<p>Für Sie heißt das: Ein Dortmunder Termin ist erst sicher, wenn die Verordnung im Amtsblatt steht. Die Tabelle verlinkt jede Ausgabe, in der wir sie gefunden haben. Andere Städte im Ruhrgebiet: ${h.a('stadt-essen', 'Essen')} und ${h.a('stadt-duisburg', 'Duisburg')}.</p>`,
  }, {
    slug: 'shopping-sundays-dortmund', card: 'One ordinance per date, centre and districts',
    title: 'Shopping Sundays Dortmund 2026: every date at a glance',
    description: 'Shopping Sundays in Dortmund 2026: every date from the official gazette for the centre, Hörde, Aplerbeck, Hombruch and Lütgendortmund, with occasion and hours.',
    h1: 'Shopping Sundays in Dortmund',
    intro: 'The finder shows Dortmund’s next released Sundays with district and occasion, based on your device’s date.',
    resume: `Dortmund issues a separate public order ordinance for each shopping Sunday and publishes it in the official gazette, often only weeks before the date. For 2026 we went through issues 1 to 42 and found ${anz('dortmund', 2026)} dates: the centre inside the Wallring on 19 April for the e-bike festival and on 8 November for the Hanseatic market, Hörde for its spring festival and duck market, Aplerbeck for its artists’ market, Hombruch for a street festival, bike race and club day, and Lütgendortmund for its St Martin’s market. Every date runs from 1 pm to 6 pm. In September 2025 the city announced further Sundays, including a Christmas-market Sunday in the centre on 6 December. On 29 October 2026 the ordinance for it was still outstanding, and without it we do not list the date. Nothing has been published for 2027 yet.`,
    faqs: [
      { q: 'Is there a shopping Sunday for Dortmund’s Christmas market in 2026?', a: 'It was announced for 6 December, but no ordinance had been published by 29 October 2026. Dortmund announces each date separately in the gazette, often shortly before. We will add the Sunday once the ordinance appears; until then it is not in the calendar.' },
      { q: 'When are shops open on Sunday in Dortmund city centre?', a: 'In 2026 on 19 April for the e-bike festival and on 8 November for the Hanseatic market, each from 1 pm to 6 pm inside the Wallring. The other dates cover Hörde, Aplerbeck, Hombruch and Lütgendortmund. A third centre date for the Christmas market has been announced but not yet published.' },
      { q: 'Why are some announced Dortmund dates missing from the list?', a: 'Because the city’s announcement of September 2025 was only a plan. Legally, the ordinance in the gazette is what counts. We found none for 30 August in Lütgendortmund or for 6 September in Aplerbeck, Mengede and Hombruch. Once an ordinance appears, we add the date.' },
    ],
    text: (h) => `<h2>One ordinance for each Sunday</h2>
<p>Other cities adopt their Sundays for the whole year in one go. Dortmund works date by date: each release has its own ordinance and its own reasons. That makes each release more robust in court, because the city can describe the occasion close to the event, but it also means the calendar stays incomplete for a long time. A date announced in spring can be missing until the last moment.</p>
<p>For you this means a Dortmund date is certain only once the ordinance is in the gazette. The table links every issue in which we found one. Other Ruhr cities: ${h.a('stadt-essen', 'Essen')} and ${h.a('stadt-duisburg', 'Duisburg')}.</p>`,
  }),

  stadt('essen', 55, ['stadt-dortmund', 'stadt-duisburg', 'land-nw'], {
    slug: 'verkaufsoffener-sonntag-essen', card: 'Die meisten Termine: acht Stadtteile und die City',
    title: 'Verkaufsoffener Sonntag Essen 2026: Termine aller Stadtteile',
    description: 'Verkaufsoffener Sonntag in Essen 2026: alle Termine aus dem Amtsblatt für Innenstadt, Rüttenscheid, Steele, Kettwig, Werden, Borbeck, Altenessen, Kupferdreh.',
    h1: 'Verkaufsoffener Sonntag in Essen',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Essen mit Stadtteil und Fest, nach dem Datum Ihres Geräts.',
    resume: `Essen hat mehr verkaufsoffene Termine als jede andere Stadt unserer Liste: ${anz('essen', 2026)} Einträge im Jahr 2026, verteilt auf die Innenstadt und acht Stadtteile. Die Stadt erlässt für jeden Sonntag und jeden Stadtteil eine eigene Verordnung und hat sie in zwei Paketen im Amtsblatt veröffentlicht, im Februar und im Juli. Die Innenstadt öffnet zum Essener Wintertraum im März, zu Essen.Original im Mai, zur Eröffnung der Lichtwochen im Oktober und zum Internationalen Weihnachtsmarkt am 3. Advent. Kettwig hat vier Termine, Steele drei, dazu kommen Rüttenscheid, Werden, Borbeck, Altenessen und Kupferdreh. Auffällig ist der 1. Advent am 29. November 2026: An diesem Tag öffnen fünf Stadtteile gleichzeitig zu ihren Weihnachtsmärkten. Alle Termine laufen von 13 bis 18 Uhr. Für 2027 lag am 29. Oktober 2026 noch keine Verordnung vor.`,
    faqs: [
      { q: 'Wann ist in der Essener Innenstadt verkaufsoffen?', a: 'Im Jahr 2026 viermal: am 8. März zum Wintertraum, am 10. Mai zu Essen.Original, am 25. Oktober zur Eröffnung der Lichtwochen und am 13. Dezember zum Internationalen Weihnachtsmarkt, jeweils von 13 bis 18 Uhr. Die anderen Essener Termine gelten nur in einzelnen Stadtteilen.' },
      { q: 'Welche Stadtteile in Essen öffnen am 1. Advent?', a: 'Am 29. November 2026 öffnen Altenessen, Borbeck, Kupferdreh, Steele und Werden zu ihren Advents- und Weihnachtsmärkten, jeweils von 13 bis 18 Uhr. Die Innenstadt öffnet nicht am 1., sondern am 3. Advent, zusammen mit Rüttenscheid zum Wintermarkt. Für jeden Stadtteil gibt es eine eigene Verordnung im Amtsblatt.' },
      { q: 'Warum hat Essen so viele verkaufsoffene Sonntage?', a: 'Weil das Gesetz in Nordrhein-Westfalen die Höchstzahl je Freigabegebiet zählt. Jeder Essener Stadtteil bleibt unter der Grenze, zusammen ergibt das aber viele Einträge. Jede Freigabe hat ihre eigene Verordnung mit eigenem Anlass, meist einem traditionellen Stadtteilfest. Für 2027 hat die Stadt noch nichts veröffentlicht.' },
    ],
    text: (h) => `<h2>Feste mit langer Tradition</h2>
<p>Viele Essener Anlässe tragen eine Zahl im Namen: das 48. Steeler Weinfest, das 43. Borbecker Marktfest, der 54. Internationale Weihnachtsmarkt. Das ist kein Zufall. Gerichte prüfen bei einer Freigabe, ob das Fest selbst die Besucher anzieht, und ein über Jahrzehnte gewachsenes Fest erfüllt diese Bedingung leichter als ein neu erfundener Anlass.</p>
<p>Wer in Essen am Sonntag einkaufen will, muss also wissen, wo gefeiert wird. Am 13. September etwa öffnen Kettwig zum Brunnenfest und Kupferdreh zum Sonnenblumenfest, die Innenstadt bleibt geschlossen. Die Tabelle zeigt für jeden Termin das Gebiet und verlinkt die Ausgabe des Amtsblatts. Nachbarstädte: ${h.a('stadt-dortmund', 'Dortmund')} und ${h.a('stadt-duisburg', 'Duisburg')}.</p>`,
  }, {
    slug: 'shopping-sundays-essen', card: 'The most dates: eight districts and the centre',
    title: 'Shopping Sundays Essen 2026: dates for every district',
    description: 'Shopping Sundays in Essen 2026: every gazette date for the centre, Rüttenscheid, Steele, Kettwig, Werden, Borbeck, Altenessen and Kupferdreh, with occasion.',
    h1: 'Shopping Sundays in Essen',
    intro: 'The finder shows Essen’s next released Sundays with district and festival, based on your device’s date.',
    resume: `Essen has more shopping dates than any other town on our list: ${anz('essen', 2026)} entries in 2026, spread over the centre and eight districts. The city issues a separate ordinance for each Sunday and each district and published them in two batches in the official gazette, in February and July. The centre opens for the Wintertraum in March, Essen.Original in May, the opening of the Lichtwochen illuminations in October and the International Christmas Market on the third Advent Sunday. Kettwig has four dates and Steele three, alongside Rüttenscheid, Werden, Borbeck, Altenessen and Kupferdreh. The first Advent Sunday, 29 November 2026, stands out: five districts open at once for their Christmas markets. Every date runs from 1 pm to 6 pm. No ordinance for 2027 had appeared by 29 October 2026.`,
    faqs: [
      { q: 'When are shops open on Sunday in Essen city centre?', a: 'Four times in 2026: on 8 March for the Wintertraum, on 10 May for Essen.Original, on 25 October for the opening of the Lichtwochen and on 13 December for the International Christmas Market, each from 1 pm to 6 pm. The other Essen dates apply only in single districts.' },
      { q: 'Which Essen districts open on the first Advent Sunday?', a: 'On 29 November 2026 Altenessen, Borbeck, Kupferdreh, Steele and Werden open for their Advent and Christmas markets, each from 1 pm to 6 pm. The centre opens not on the first but on the third Advent Sunday, together with Rüttenscheid for its winter market.' },
      { q: 'Why does Essen have so many shopping Sundays?', a: 'Because North Rhine-Westphalia counts the maximum per release area. Each Essen district stays below the limit, but together they add up to many entries. Each release has its own ordinance and occasion, usually a long-standing district festival. The city has published nothing for 2027 yet.' },
    ],
    text: (h) => `<h2>Festivals with a long tradition</h2>
<p>Many Essen occasions carry a number in their name: the 48th Steele wine festival, the 43rd Borbeck market festival, the 54th International Christmas Market. That is no accident. When reviewing a release, courts ask whether the festival itself draws the visitors, and a festival that has grown over decades meets that test more easily than a newly invented occasion.</p>
<p>So if you want to shop in Essen on a Sunday, you need to know where the festival is. On 13 September, for instance, Kettwig opens for its fountain festival and Kupferdreh for its sunflower festival, while the centre stays shut. The table shows the area for each date and links the gazette issue. Neighbouring cities: ${h.a('stadt-dortmund', 'Dortmund')} and ${h.a('stadt-duisburg', 'Duisburg')}.</p>`,
  }),

  stadt('stuttgart', 56, ['land-bw', 'stadt-karlsruhe', 'gesetze'], {
    slug: 'verkaufsoffener-sonntag-stuttgart', card: 'Nur Stadtbezirke, keine Innenstadt',
    title: 'Verkaufsoffener Sonntag Stuttgart 2026: Termine der Bezirke',
    description: 'Verkaufsoffener Sonntag in Stuttgart 2026: Termine der Allgemeinverfügung für die Stadtbezirke, zwei Widerrufe und warum die Innenstadt geschlossen bleibt.',
    h1: 'Verkaufsoffener Sonntag in Stuttgart',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in den Stuttgarter Stadtbezirken, nach dem Datum Ihres Geräts.',
    resume: `In Stuttgart gibt es verkaufsoffene Sonntage nur in den Stadtbezirken, nicht in der Innenstadt. Das Amt für öffentliche Ordnung hat die Termine für 2026 in einer Allgemeinverfügung vom 24. November 2025 festgelegt: Kirben, Herbstfeste und Märkte in Bad Cannstatt, Weilimdorf, Sillenbuch, Zuffenhausen, Feuerbach, Vaihingen, Hedelfingen, Möhringen, Degerloch und Untertürkheim. Zwei Termine hat die Stadt später widerrufen, weil die Feste ausfielen: Vaihingen am 10. Mai und Bad Cannstatt am 8. November. Der Termin „Musik und Wein“ in Bad Cannstatt wurde vom 12. April auf den 10. Mai verlegt. Damit stehen ${anz('stuttgart', 2026)} Einträge für 2026 in der Liste. Die Zeiten wechseln: Manche Bezirke öffnen von 12 bis 17 Uhr, andere von 13 bis 18 Uhr. In Baden-Württemberg darf jede Gemeinde höchstens drei Tage im Jahr freigeben, und der Advent ist gesperrt. Für 2027 lag noch keine Allgemeinverfügung vor.`,
    faqs: [
      { q: 'Gibt es in der Stuttgarter Innenstadt einen verkaufsoffenen Sonntag?', a: 'Im Jahr 2026 nicht. Alle Stuttgarter Termine betreffen Stadtbezirke wie Bad Cannstatt, Feuerbach oder Vaihingen, jeweils rund um ein Fest. Die Königstraße und das Zentrum bleiben sonntags geschlossen. Auch einen Adventssonntag gibt es nicht, weil das Landesgesetz in Baden-Württemberg den Advent sperrt.' },
      { q: 'Welche Stuttgarter Termine wurden 2026 abgesagt?', a: 'Die Stadt hat zwei Freigaben teilweise widerrufen: Vaihingen am 10. Mai, weil der Vaihinger Frühling ausfiel, und Bad Cannstatt am 8. November, weil der Martini-Umzug abgesagt wurde. Ohne Fest fehlt der Anlass, und damit die Rechtsgrundlage für die Öffnung. Beide Tage stehen deshalb nicht mehr im Kalender.' },
      { q: 'Wie lange haben die Geschäfte in Stuttgart sonntags offen?', a: 'Fünf Stunden, je nach Bezirk von 12 bis 17 Uhr oder von 13 bis 18 Uhr. Das Landesgesetz erlaubt höchstens fünf zusammenhängende Stunden, die um 18 Uhr enden. Die genaue Zeit steht in der Allgemeinverfügung und bei jedem Termin im Finder.' },
    ],
    text: (h) => `<h2>Kirbe statt Königstraße</h2>
<p>Die Stuttgarter Liste liest sich wie ein Festkalender der Bezirke: die Feuerbacher und die Degerlocher Kirbe, der Weilemer und der Vaihinger Herbst, das Fleckenfest in Zuffenhausen, der Knausbira-Sonntag in Hedelfingen. Nur Weilimdorf und Sillenbuch haben zwei Termine, alle anderen Bezirke einen. Das passt zum Gesetz: Baden-Württemberg erlaubt mit drei Tagen die wenigsten Sonntage aller Länder.</p>
<p>Die Widerrufe zeigen, wie eng Fest und Öffnung verbunden sind. Fällt das Fest aus, fällt auch der Sonntag. Wir tragen solche Änderungen ein, sobald die Stadt sie veröffentlicht; die Quellen in der Tabelle führen zu jeder Allgemeinverfügung. Eine andere Großstadt im Land: ${h.a('stadt-karlsruhe', 'Karlsruhe')}.</p>`,
  }, {
    slug: 'shopping-sundays-stuttgart', card: 'Districts only, no city centre',
    title: 'Shopping Sundays Stuttgart 2026: dates in the districts',
    description: 'Shopping Sundays in Stuttgart 2026: the dates of the general order for the city districts, two revocations, and why the city centre stays closed on Sundays.',
    h1: 'Shopping Sundays in Stuttgart',
    intro: 'The finder shows the next released Sundays in Stuttgart’s districts, based on your device’s date.',
    resume: `In Stuttgart shopping Sundays happen only in the districts, never in the city centre. The public order office set the 2026 dates in a general order of 24 November 2025: fairs, autumn festivals and markets in Bad Cannstatt, Weilimdorf, Sillenbuch, Zuffenhausen, Feuerbach, Vaihingen, Hedelfingen, Möhringen, Degerloch and Untertürkheim. The city later revoked two dates because the festivals were cancelled: Vaihingen on 10 May and Bad Cannstatt on 8 November. The “Musik und Wein” date in Bad Cannstatt moved from 12 April to 10 May. That leaves ${anz('stuttgart', 2026)} entries for 2026 on the list. Hours vary: some districts open from noon to 5 pm, others from 1 pm to 6 pm. In Baden-Württemberg each town may release no more than three days a year, and Advent is barred. No general order for 2027 had appeared yet.`,
    faqs: [
      { q: 'Is there a shopping Sunday in Stuttgart city centre?', a: 'Not in 2026. Every Stuttgart date covers a district such as Bad Cannstatt, Feuerbach or Vaihingen, each around a festival. Königstraße and the centre stay closed on Sundays. There is no Advent Sunday either, because Baden-Württemberg’s act bars Advent. The districts open around their own festivals instead.' },
      { q: 'Which Stuttgart dates were cancelled in 2026?', a: 'The city partly revoked two releases: Vaihingen on 10 May, because its spring festival was called off, and Bad Cannstatt on 8 November, because the St Martin’s procession was cancelled. Without the festival there is no occasion, and so no legal basis for opening.' },
      { q: 'How long are shops open on Sunday in Stuttgart?', a: 'Five hours, from noon to 5 pm or from 1 pm to 6 pm depending on the district. The state act allows five consecutive hours at most, ending by 6 pm. The exact hours are in the general order and shown for each date in the finder.' },
    ],
    text: (h) => `<h2>District fairs instead of Königstraße</h2>
<p>Stuttgart’s list reads like a festival calendar of its districts: the Feuerbach and Degerloch fairs, the Weilimdorf and Vaihingen autumn festivals, the Fleckenfest in Zuffenhausen, the Knausbira Sunday in Hedelfingen. Only Weilimdorf and Sillenbuch have two dates; every other district has one. That fits the law: with three days, Baden-Württemberg allows the fewest Sundays of any state.</p>
<p>The revocations show how closely festival and opening are linked. If the festival goes, so does the Sunday. We record such changes once the city publishes them; the sources in the table lead to each general order. Another large city in the state: ${h.a('stadt-karlsruhe', 'Karlsruhe')}.</p>`,
  }),

  stadt('leipzig', 57, ['stadt-dresden', 'land-sn', 'advent'], {
    slug: 'verkaufsoffener-sonntag-leipzig', card: 'Zwei Adventssonntage in der Innenstadt',
    title: 'Verkaufsoffener Sonntag Leipzig 2026: Advent im Zentrum',
    description: 'Verkaufsoffener Sonntag in Leipzig 2026: die zwei Adventssonntage zum Weihnachtsmarkt in der Innenstadt, Uhrzeit nach sächsischem Recht und Stand für 2027.',
    h1: 'Verkaufsoffener Sonntag in Leipzig',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Leipzig, nach dem Datum Ihres Geräts.',
    resume: `Leipzig nennt für 2026 zwei verkaufsoffene Sonntage, beide in der Adventszeit: den 1. Advent am 29. November und den 3. Advent am 13. Dezember, jeweils in der Innenstadt, also im Ortsteil Zentrum mit den Promenaden im Hauptbahnhof, und jeweils zum Leipziger Weihnachtsmarkt. Rechtsgrundlage ist eine Verordnung der Stadt nach § 8 des Sächsischen Ladenöffnungsgesetzes. Sachsen ist eines der wenigen Länder, die Adventssonntage ausdrücklich zulassen, und schreibt die Uhrzeit fest vor: 12 bis 18 Uhr. Die Stadtseite weist darauf hin, dass viele Geschäfte erst ab 13 Uhr öffnen. Weitere Sonntage im Frühjahr oder Herbst nennt die Stadt für 2026 nicht. Für 2027 ist noch keine Verordnung veröffentlicht; Leipzig beschließt sie in der Regel im Laufe des Vorjahres oder zu Jahresbeginn. Wer in der Adventszeit nach Leipzig fährt, findet an diesen beiden Sonntagen die Innenstadtgeschäfte offen.`,
    faqs: [
      { q: 'An welchen Adventssonntagen ist Leipzig verkaufsoffen?', a: 'Im Jahr 2026 am 1. Advent, dem 29. November, und am 3. Advent, dem 13. Dezember, jeweils in der Innenstadt zum Weihnachtsmarkt. Das sächsische Gesetz erlaubt 12 bis 18 Uhr; nach Angabe der Stadt öffnen viele Geschäfte erst um 13 Uhr. Der 2. und der 4. Advent sind nicht freigegeben.' },
      { q: 'Gehören die Geschäfte im Hauptbahnhof dazu?', a: 'Die Freigabe gilt für den Ortsteil Zentrum einschließlich der Promenaden im Hauptbahnhof. Bahnhofsgeschäfte haben ohnehin eigene Öffnungsregeln für Reisebedarf; an den beiden Adventssonntagen dürfen dort alle Geschäfte nach den Regeln der Verordnung öffnen. Die Uhrzeit ist dieselbe wie in der übrigen Innenstadt: 12 bis 18 Uhr nach Landesrecht.' },
      { q: 'Wann veröffentlicht Leipzig die Termine 2027?', a: 'Eine Verordnung für 2027 lag am 29. Oktober 2026 noch nicht vor. Sobald die Stadt sie beschließt und bekannt macht, ergänzen wir die Termine. Bis dahin steht Leipzig für 2027 mit „noch nicht veröffentlicht“ in der Liste. Die beiden Adventstermine 2026 bleiben davon unberührt.' },
    ],
    text: (h) => `<h2>Weihnachtsmarkt als Anlass</h2>
<p>Sachsen erlaubt vier Sonntage im Jahr und dazu einen für ein regionales Ereignis. Leipzig nutzt für 2026 nur zwei, beide im Advent. Das unterscheidet die Stadt von ${h.a('stadt-dresden', 'Dresden')}, das neben den Adventssonntagen auch Stadtteilfeste im Sommer und Herbst freigibt. Ein Grund für die Konzentration auf den Advent: Der Weihnachtsmarkt ist ein Anlass mit großem eigenen Besucherstrom, wie ihn das Gesetz verlangt.</p>
<p>Die Uhrzeit ist in Sachsen nicht verhandelbar. Anders als in den meisten Ländern legt das Gesetz nicht nur eine Höchstdauer fest, sondern ein festes Fenster von 12 bis 18 Uhr. Mehr zu den Regeln im Advent: ${h.a('advent', 'verkaufsoffener Sonntag im Advent')}.</p>`,
  }, {
    slug: 'shopping-sundays-leipzig', card: 'Two Advent Sundays in the city centre',
    title: 'Shopping Sundays Leipzig 2026: Advent in the city centre',
    description: 'Shopping Sundays in Leipzig 2026: the two Advent Sundays for the Christmas market in the city centre, the hours under Saxon law, and the position for 2027.',
    h1: 'Shopping Sundays in Leipzig',
    intro: 'The finder shows Leipzig’s next released Sundays, based on your device’s date.',
    resume: `Leipzig names two shopping Sundays for 2026, both in Advent: the first Advent Sunday on 29 November and the third on 13 December, each in the city centre, meaning the Zentrum district including the shopping arcades in the main station, and each for the Leipzig Christmas market. The legal basis is a city ordinance under section 8 of the Saxon Shop Opening Act. Saxony is one of the few states that expressly allow Advent Sundays, and it fixes the hours: noon to 6 pm. The city’s page notes that many shops open only from 1 pm. The city names no other Sundays in spring or autumn for 2026. No ordinance for 2027 has been published yet; Leipzig usually adopts it during the preceding year or early in the year. Anyone visiting Leipzig in Advent will find the centre’s shops open on these two Sundays.`,
    faqs: [
      { q: 'Which Advent Sundays are shopping Sundays in Leipzig?', a: 'In 2026 the first Advent Sunday, 29 November, and the third, 13 December, each in the city centre for the Christmas market. Saxon law allows noon to 6 pm; according to the city many shops open only at 1 pm. The second and fourth Advent Sundays are not released.' },
      { q: 'Are the shops in the main station included?', a: 'The release covers the Zentrum district including the arcades in the main station. Station shops already have their own rules for travel goods; on the two Advent Sundays every shop there may open under the ordinance. The hours are the same as in the rest of the centre: noon to 6 pm under state law.' },
      { q: 'When will Leipzig publish its 2027 dates?', a: 'No ordinance for 2027 had appeared by 29 October 2026. As soon as the city adopts and announces it, we will add the dates. Until then Leipzig appears for 2027 as “not yet published”. The two Advent dates of 2026 are not affected and stand as published.' },
    ],
    text: (h) => `<h2>The Christmas market as the occasion</h2>
<p>Saxony allows four Sundays a year plus one for a regional event. Leipzig uses only two for 2026, both in Advent. That sets it apart from ${h.a('stadt-dresden', 'Dresden')}, which releases district festivals in summer and autumn as well as Advent Sundays. One reason for the Advent focus: the Christmas market is an occasion with a large crowd of its own, as the law requires.</p>
<p>Hours are not negotiable in Saxony. Unlike most states, the act sets not just a maximum length but a fixed window from noon to 6 pm. More on the rules in Advent: ${h.a('advent', 'shopping Sundays in Advent')}.</p>`,
  }),

  stadt('dresden', 58, ['stadt-leipzig', 'land-sn', 'advent'], {
    slug: 'verkaufsoffener-sonntag-dresden', card: 'Striezelmarkt-Sonntage für die ganze Stadt',
    title: 'Verkaufsoffener Sonntag Dresden 2026: Advent und Feste',
    description: 'Verkaufsoffener Sonntag in Dresden 2026: zwei Adventssonntage zum Striezelmarkt im ganzen Stadtgebiet und drei Stadtteilfeste, jeweils von 12 bis 18 Uhr.',
    h1: 'Verkaufsoffener Sonntag in Dresden',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Dresden mit Gebiet und Anlass, nach dem Datum Ihres Geräts.',
    resume: `Dresden hat für 2026 fünf verkaufsoffene Sonntage beschlossen, in zwei Verordnungen der Landeshauptstadt. Zwei davon gelten im ganzen Stadtgebiet: der 1. Advent am 29. November und der 3. Advent am 13. Dezember, beide aus Anlass des 592. Striezelmarkts und der übrigen Weihnachtsmärkte in Altstadt und Neustadt. Die drei anderen sind regionale Termine nach § 8 Abs. 2 des sächsischen Gesetzes und gelten nur in einzelnen Straßenzügen: Pieschen-Süd am 7. Juni zum Stadtteilfest „sankt pieschen“, Loschwitz am 28. Juni zum Elbhangfest zwischen Körnerplatz und Schloss Pillnitz, die Innere Neustadt am 4. Oktober zum Familienfest am Goldenen Reiter. Alle Termine laufen von 12 bis 18 Uhr, wie es das Land vorschreibt. Für 2027 lag am 29. Oktober 2026 noch keine Verordnung vor; Dresden beschließt sie üblicherweise zu Jahresbeginn.`,
    faqs: [
      { q: 'Ist in Dresden zum Striezelmarkt verkaufsoffen?', a: 'Ja. Am 1. Advent, dem 29. November 2026, und am 3. Advent, dem 13. Dezember 2026, dürfen alle Geschäfte im ganzen Stadtgebiet von 12 bis 18 Uhr öffnen. Anlass sind der 592. Striezelmarkt und die übrigen Weihnachtsmärkte in Altstadt und Neustadt.' },
      { q: 'Was bedeutet ein regionaler Termin in Dresden?', a: 'Das sächsische Gesetz erlaubt neben den vier Sonntagen für die ganze Gemeinde weitere Sonntage für ein regionales Ereignis, begrenzt auf das betroffene Gebiet. In Dresden betrifft das 2026 das Elbhangfest in Loschwitz, das Stadtteilfest in Pieschen und das Familienfest in der Inneren Neustadt, jeweils nur in den genannten Straßen.' },
      { q: 'Öffnen beim Elbhangfest alle Geschäfte in Loschwitz?', a: 'Nur in den Straßen, die die Verordnung nennt, vom Körnerplatz entlang der Pillnitzer Landstraße bis Schloss Pillnitz, am 28. Juni 2026 von 12 bis 18 Uhr. Geschäfte außerhalb dieses Gebiets bleiben geschlossen. Die Verordnung ist in der Tabelle verlinkt. Für die übrigen Stadtteile gelten nur die beiden Adventssonntage.' },
    ],
    text: (h) => `<h2>Ganze Stadt im Advent, Straßenzüge im Sommer</h2>
<p>Dresden zeigt, wie das sächsische Gesetz zwei Arten von Sonntagen kennt. Die Adventssonntage gelten für alle Verkaufsstellen der Stadt, weil der Striezelmarkt Besucher aus dem ganzen Land anzieht. Die Sommer- und Herbsttermine dagegen sind an ein Fest in einem Stadtteil gebunden und nur dort wirksam. Auf diese Weise bleibt die Stadt innerhalb der Höchstzahl und kann trotzdem mehrere Feste begleiten.</p>
<p>Im Vergleich zu ${h.a('stadt-leipzig', 'Leipzig')}, das 2026 nur die beiden Adventssonntage freigibt, nutzt Dresden den Spielraum des Landes stärker. Der 2. und der 4. Advent bleiben in beiden Städten geschlossen. Die Regeln für den Advent in allen Ländern: ${h.a('advent', 'Advent')}.</p>`,
  }, {
    slug: 'shopping-sundays-dresden', card: 'Striezelmarkt Sundays for the whole city',
    title: 'Shopping Sundays Dresden 2026: Advent and district festivals',
    description: 'Shopping Sundays in Dresden 2026: two Advent Sundays for the Striezelmarkt across the whole city and three district festivals, each open from noon to 6 pm.',
    h1: 'Shopping Sundays in Dresden',
    intro: 'The finder shows Dresden’s next released Sundays with area and occasion, based on your device’s date.',
    resume: `Dresden adopted five shopping Sundays for 2026 in two ordinances of the state capital. Two apply across the whole city: the first Advent Sunday on 29 November and the third on 13 December, both for the 592nd Striezelmarkt and the other Christmas markets in the Altstadt and Neustadt. The other three are regional dates under section 8(2) of the Saxon act and apply only to certain streets: Pieschen-Süd on 7 June for the “sankt pieschen” district festival, Loschwitz on 28 June for the Elbhangfest between Körnerplatz and Pillnitz Palace, and the Innere Neustadt on 4 October for the family festival at the Golden Rider. Every date runs from noon to 6 pm, as the state prescribes. No ordinance for 2027 had appeared by 29 October 2026; Dresden usually adopts it early in the year.`,
    faqs: [
      { q: 'Are shops open in Dresden for the Striezelmarkt?', a: 'Yes. On the first Advent Sunday, 29 November 2026, and the third, 13 December 2026, every shop across the city may open from noon to 6 pm. The occasion is the 592nd Striezelmarkt and the other Christmas markets in the Altstadt and Neustadt.' },
      { q: 'What is a regional date in Dresden?', a: 'Besides four Sundays for the whole municipality, the Saxon act allows further Sundays for a regional event, limited to the area concerned. In Dresden in 2026 these are the Elbhangfest in Loschwitz, the Pieschen district festival and the family festival in the Innere Neustadt, each only in the streets named.' },
      { q: 'Do all shops in Loschwitz open for the Elbhangfest?', a: 'Only in the streets the ordinance names, from Körnerplatz along Pillnitzer Landstraße to Pillnitz Palace, on 28 June 2026 from noon to 6 pm. Shops outside that area stay closed. The ordinance is linked in the table. Other districts have only the two Advent Sundays.' },
    ],
    text: (h) => `<h2>Whole city in Advent, single streets in summer</h2>
<p>Dresden shows the two kinds of Sunday the Saxon act provides. The Advent Sundays apply to every shop in the city, because the Striezelmarkt draws visitors from across the country. The summer and autumn dates, by contrast, are tied to a festival in one district and take effect only there. That way the city stays within the maximum and can still accompany several festivals.</p>
<p>Compared with ${h.a('stadt-leipzig', 'Leipzig')}, which releases only the two Advent Sundays in 2026, Dresden makes fuller use of the state’s leeway. The second and fourth Advent Sundays stay closed in both cities. Advent rules in every state: ${h.a('advent', 'Advent')}.</p>`,
  }),

  stadt('hannover', 59, ['land-ni', 'stadt-bielefeld', 'heute'], {
    slug: 'verkaufsoffener-sonntag-hannover', card: 'Mitte und Hainholz im November',
    title: 'Verkaufsoffener Sonntag Hannover 2026: Termine und Stand',
    description: 'Verkaufsoffener Sonntag in Hannover 2026: die bekannten Termine in Mitte und Hainholz, warum die Stadt sie nicht im Amtsblatt veröffentlicht, Stand 2027.',
    h1: 'Verkaufsoffener Sonntag in Hannover',
    intro: 'Der Finder zeigt die nächsten bekannten Sonntage in Hannover, nach dem Datum Ihres Geräts.',
    resume: `Hannover ist ein Sonderfall. Die Landeshauptstadt veröffentlicht ihre Sonntagsfreigaben nicht im Amtsblatt; wir haben die Ausgaben 1 bis 43 des Jahres 2026 durchgesehen und keinen Eintrag gefunden. Die einzige amtliche Übersicht führt die Hannover Marketing und Tourismus GmbH, die städtische Gesellschaft, die auch die Seite hannover.de redaktionell verantwortet. Sie nennt nur die jeweils kommenden Termine; frühere Sonntage des Jahres verschwinden aus der Liste. Bekannt sind deshalb für 2026 nur zwei Termine, beide am 8. November: in Mitte zur Aktion „Hannover hilft! – St. Martin“ und in Hainholz zu „Kunst & Kultur“. Eine Uhrzeit nennt die Übersicht nicht; das niedersächsische Gesetz erlaubt bis zu fünf Stunden außerhalb der Gottesdienstzeiten. Weitere Sonntage, die Zeitungen für 2026 gemeldet haben, konnten wir nicht amtlich belegen. Für 2027 ist noch nichts veröffentlicht.`,
    faqs: [
      { q: 'Wann ist in Hannover verkaufsoffen?', a: 'Amtlich bekannt ist für 2026 der 8. November, in Mitte zur Aktion „Hannover hilft! – St. Martin“ und in Hainholz zu „Kunst & Kultur“. Weitere Termine des Jahres nennt die Übersicht der städtischen Marketinggesellschaft nicht mehr. Für 2027 hat die Stadt noch nichts veröffentlicht.' },
      { q: 'Warum gibt es für Hannover so wenige Termine?', a: 'Weil die Freigaben in Niedersachsen auf Antrag der Geschäfte erteilt werden und Hannover sie nicht im Amtsblatt bekannt macht. Die Übersicht der städtischen Gesellschaft zeigt nur kommende Termine. Ältere Sonntage lassen sich deshalb nicht mehr amtlich belegen, und wir tragen nur ein, was eine amtliche Stelle nennt.' },
      { q: 'Ist in Hannover im Advent verkaufsoffen?', a: 'Nein. Das niedersächsische Gesetz sperrt alle Adventssonntage, ebenso den Palmsonntag, Ostersonntag, Pfingstsonntag, Volkstrauertag, Totensonntag und Feiertage. Der Weihnachtsmarkt in der Altstadt ist daher kein Anlass für einen verkaufsoffenen Sonntag. Der letzte mögliche Sonntag vor Weihnachten liegt deshalb im November vor dem Volkstrauertag.' },
    ],
    text: (h) => `<h2>Antrag statt Verordnung</h2>
<p>In Niedersachsen beschließt nicht der Rat eine Verordnung, sondern die zuständige Behörde gibt einen Sonntag auf Antrag der Geschäfte oder ihrer Vereinigung frei. Das Gesetz erlaubt sechs Sonntage je Gemeinde, aber höchstens vier für denselben Ortsbereich. Eine Pflicht, die Freigabe im Amtsblatt zu veröffentlichen, gibt es nicht ausdrücklich, und Hannover verzichtet darauf.</p>
<p>Für Besucher heißt das: Was in Hannover am Sonntag geöffnet ist, erfährt man am verlässlichsten kurz vorher aus der Übersicht der Stadt. Wir prüfen sie bei jeder Aktualisierung und tragen neue Termine ein. Mehr zum Landesrecht: ${h.a('land-ni', 'Niedersachsen')}.</p>`,
  }, {
    slug: 'shopping-sundays-hanover', card: 'Mitte and Hainholz in November',
    title: 'Shopping Sundays Hanover 2026: dates and current status',
    description: 'Shopping Sundays in Hanover 2026: the known dates in Mitte and Hainholz, why the city does not publish them in its official gazette, and what is fixed for 2027.',
    h1: 'Shopping Sundays in Hanover',
    intro: 'The finder shows Hanover’s next known Sundays, based on your device’s date.',
    resume: `Hanover is a special case. The state capital does not publish its Sunday releases in the official gazette; we went through issues 1 to 43 of 2026 and found no entry. The only official overview is kept by Hannover Marketing und Tourismus GmbH, the city’s company that also runs the editorial side of hannover.de. It lists only upcoming dates; earlier Sundays of the year drop off the list. So only two dates are known for 2026, both on 8 November: in Mitte for the “Hannover hilft! – St. Martin” campaign and in Hainholz for “Kunst & Kultur”. The overview gives no hours; Lower Saxony’s act allows up to five hours outside church service times. Further Sundays that newspapers reported for 2026 could not be confirmed from an official source. Nothing has been published for 2027 yet.`,
    faqs: [
      { q: 'When are shops open on Sunday in Hanover?', a: 'Officially known for 2026 is 8 November, in Mitte for the “Hannover hilft! – St. Martin” campaign and in Hainholz for “Kunst & Kultur”. The city marketing company’s overview no longer lists the year’s other dates. The city has published nothing for 2027 yet.' },
      { q: 'Why are there so few dates for Hanover?', a: 'Because in Lower Saxony releases are granted on application by the shops, and Hanover does not announce them in its gazette. The city company’s overview shows only upcoming dates. Older Sundays therefore cannot be confirmed officially, and we list only what an official body names.' },
      { q: 'Are shops open in Hanover during Advent?', a: 'No. Lower Saxony’s act bars every Advent Sunday, as well as Palm Sunday, Easter Sunday, Whit Sunday, Volkstrauertag, Totensonntag and public holidays. The old-town Christmas market is therefore no occasion for a shopping Sunday. The last possible Sunday before Christmas therefore falls in November, before Volkstrauertag.' },
    ],
    text: (h) => `<h2>Application instead of ordinance</h2>
<p>In Lower Saxony the council does not adopt an ordinance; the competent authority releases a Sunday on application by the shops or their association. The act allows six Sundays per municipality, but no more than four for the same area. There is no express duty to publish the release in the gazette, and Hanover does not.</p>
<p>For visitors this means the most reliable way to know what is open in Hanover on a Sunday is the city’s overview shortly before. We check it at every update and add new dates. More on the state rules: ${h.a('land-ni', 'Lower Saxony')}.</p>`,
  }),

  stadt('nuernberg', 60, ['stadt-muenchen', 'land-by', 'stadt-landshut'], {
    slug: 'verkaufsoffener-sonntag-nuernberg', card: 'Altstadt zu Ostermarkt und Altstadtfest',
    title: 'Verkaufsoffener Sonntag Nürnberg 2026: Altstadt-Termine',
    description: 'Verkaufsoffener Sonntag in Nürnberg 2026: die Termine der städtischen Verordnung in der Altstadt, Uhrzeit nach bayerischem Recht und verkaufsoffene Nächte.',
    h1: 'Verkaufsoffener Sonntag in Nürnberg',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Nürnberg, nach dem Datum Ihres Geräts.',
    resume: `Nürnberg war eine der ersten bayerischen Städte, die das neue Landesgesetz für 2026 genutzt haben. Die Verordnung der Stadt über die Öffnung an Sonntagen und in Nächten, im Oktober 2025 beschlossen, gibt zwei Sonntage frei, beide in der Altstadt innerhalb des Altstadtrings: den 22. März zum Ostermarkt und den 27. September zum Altstadtfest mit Herbstmarkt, jeweils von 13 bis 18 Uhr. Dazu kommen zwei verkaufsoffene Nächte, die es nach dem bayerischen Gesetz seit August 2025 gibt: am 24. Oktober und am 27. November 2026 bis 22 Uhr im ganzen Stadtgebiet. Diese Nächte sind Werktage und stehen deshalb nicht im Kalender der Sonntage. Bayern erlaubt vier Sonn- und Feiertage je Gemeinde; Nürnberg nutzt also nur einen Teil. Für 2027 ist noch keine Verordnung veröffentlicht. Die Verordnung für 2026 erschien im Oktober des Vorjahres; ein ähnlicher Zeitplan ist für 2027 zu erwarten.`,
    faqs: [
      { q: 'Wann ist in Nürnberg 2026 verkaufsoffen?', a: 'An zwei Sonntagen in der Altstadt: am 22. März zum Ostermarkt und am 27. September zum Altstadtfest mit Herbstmarkt, jeweils von 13 bis 18 Uhr. Zusätzlich gibt es verkaufsoffene Nächte am 24. Oktober und 27. November 2026 bis 22 Uhr, diese aber an Werktagen.' },
      { q: 'Ist in Nürnberg zum Christkindlesmarkt verkaufsoffen?', a: 'Nicht an einem Sonntag. Das bayerische Gesetz sperrt die Adventssonntage im Dezember, und Nürnberg hat für 2026 auch den 1. Advent am 29. November nicht freigegeben. Stattdessen gibt es am Freitag, 27. November, eine verkaufsoffene Nacht bis 22 Uhr. Sie gilt im ganzen Stadtgebiet.' },
      { q: 'Was sind verkaufsoffene Nächte in Bayern?', a: 'Seit dem 1. August 2025 dürfen bayerische Gemeinden bis zu acht Werktage im Jahr freigeben, an denen Geschäfte von 20 bis 24 Uhr öffnen. Bestimmte Tage wie Heiligabend oder der Tag vor Pfingstsonntag sind ausgeschlossen. Nürnberg nutzt das 2026 für zwei Nächte bis 22 Uhr.' },
    ],
    text: (h) => `<h2>Sonntage und Nächte in einer Verordnung</h2>
<p>Nürnberg regelt beides zusammen: die Sonntage nach Art. 6 und die Nächte nach Art. 7 des Bayerischen Ladenschlussgesetzes. Das zeigt, wie sich der Handel in Bayern seit dem neuen Gesetz verschiebt. Statt mehr Sonntage zu öffnen, setzen Städte zusätzlich auf lange Abende an Werktagen, die weniger rechtliche Hürden haben.</p>
<p>Die beiden Sonntage hängen an Märkten in der Altstadt, die seit langem Besucher anziehen. Die Freigabe gilt nur innerhalb des Altstadtrings; Geschäfte in der Südstadt oder in Einkaufszentren am Stadtrand bleiben geschlossen. Andere bayerische Städte: ${h.a('stadt-muenchen', 'München')} und ${h.a('stadt-landshut', 'Landshut')}.</p>`,
  }, {
    slug: 'shopping-sundays-nuremberg', card: 'Old town for the Easter market and old-town festival',
    title: 'Shopping Sundays Nuremberg 2026: dates in the old town',
    description: 'Shopping Sundays in Nuremberg 2026: the dates of the city ordinance in the old town, with hours under Bavarian law, plus the late shopping nights on weekdays.',
    h1: 'Shopping Sundays in Nuremberg',
    intro: 'The finder shows Nuremberg’s next released Sundays, based on your device’s date.',
    resume: `Nuremberg was one of the first Bavarian cities to use the new state act for 2026. The city’s ordinance on Sunday and night opening, adopted in October 2025, releases two Sundays, both in the old town inside the old-town ring: 22 March for the Easter market and 27 September for the old-town festival with its autumn market, each from 1 pm to 6 pm. On top come two late shopping nights, possible under the Bavarian act since August 2025: 24 October and 27 November 2026 until 10 pm across the whole city. These nights fall on weekdays and so are not in the Sunday calendar. Bavaria allows four Sundays and holidays per municipality, so Nuremberg uses only part of that. No ordinance for 2027 has been published yet. The 2026 ordinance appeared in October of the preceding year, and a similar timetable is likely for 2027.`,
    faqs: [
      { q: 'When are shops open on Sunday in Nuremberg in 2026?', a: 'On two Sundays in the old town: 22 March for the Easter market and 27 September for the old-town festival with its autumn market, each from 1 pm to 6 pm. There are also late shopping nights on 24 October and 27 November 2026 until 10 pm, but on weekdays.' },
      { q: 'Are shops open on Sunday for the Christkindlesmarkt?', a: 'Not on a Sunday. The Bavarian act bars Advent Sundays in December, and Nuremberg did not release the first Advent Sunday on 29 November 2026 either. Instead there is a late shopping night on Friday 27 November until 10 pm.' },
      { q: 'What are late shopping nights in Bavaria?', a: 'Since 1 August 2025 Bavarian towns may release up to eight weekdays a year on which shops open from 8 pm to midnight. Certain days such as Christmas Eve or the day before Whit Sunday are excluded. Nuremberg uses this in 2026 for two nights until 10 pm.' },
    ],
    text: (h) => `<h2>Sundays and nights in one ordinance</h2>
<p>Nuremberg regulates both together: Sundays under Article 6 and nights under Article 7 of the Bavarian Shop Closing Act. It shows how retail in Bavaria is shifting since the new act. Rather than opening more Sundays, towns are adding long weekday evenings, which face fewer legal hurdles.</p>
<p>Both Sundays hang on long-established old-town markets that draw visitors. The release applies only inside the old-town ring; shops in the Südstadt or in shopping centres on the edge of town stay closed. Other Bavarian cities: ${h.a('stadt-muenchen', 'Munich')} and ${h.a('stadt-landshut', 'Landshut')}.</p>`,
  }),

  stadt('karlsruhe', 61, ['stadt-stuttgart', 'land-bw', 'termine-2027'], {
    slug: 'verkaufsoffener-sonntag-karlsruhe', card: 'Termine bis 2029 beschlossen',
    title: 'Verkaufsoffener Sonntag Karlsruhe 2026 und 2027: Termine',
    description: 'Verkaufsoffener Sonntag in Karlsruhe 2026 und 2027: Termine der Satzung für Innenstadt, Durlach, Mühlburg und den Messplatz, und was bis 2029 beschlossen ist.',
    h1: 'Verkaufsoffener Sonntag in Karlsruhe',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Karlsruhe mit Gebiet und Anlass, nach dem Datum Ihres Geräts.',
    resume: `Karlsruhe plant seine verkaufsoffenen Sonntage über mehrere Jahre. Die Satzung für 2024 bis 2026 gibt jedes Jahr dieselben Feste frei: „Fest der Sinne“ in der Innenstadt und „Durlach blüht auf“ im April, die Mühlburger und die Durlacher Kerwe im September, das Stadtfest in der Innenstadt im Oktober und die Herbstmess’ am Messplatz im November, jeweils von 13 bis 18 Uhr. Im September 2026 hat der Gemeinderat die Termine für 2027 bis 2029 beschlossen; die Stadt hat sie in einer Pressemitteilung bekannt gemacht, die neue Satzung war am 29. Oktober 2026 im Stadtrecht aber noch nicht abrufbar. Für 2027 stehen deshalb schon ${anz('karlsruhe', 2027)} Termine in der Liste. Jedes Gebiet bleibt innerhalb der drei Tage, die Baden-Württemberg je Gemeinde erlaubt, weil die Satzung die Feste auf Innenstadt, Durlach, Mühlburg und das Umfeld des Messplatzes verteilt. Adventssonntage sind im Land gesperrt.`,
    faqs: [
      { q: 'Wann ist in Karlsruhe 2027 verkaufsoffen?', a: 'Der Gemeinderat hat im September 2026 beschlossen: 25. April in der Innenstadt und in Durlach, 12. September in Mühlburg, 19. September in Durlach, 10. Oktober in der Innenstadt und 7. November am Messplatz. Die Satzung war am 29. Oktober 2026 noch nicht veröffentlicht, die Stadt hat die Termine aber bekannt gemacht.' },
      { q: 'Ist in der Karlsruher Innenstadt im Advent verkaufsoffen?', a: 'Nein. Das baden-württembergische Gesetz sperrt alle Adventssonntage und die Feiertage im Dezember. Der letzte Karlsruher Termin des Jahres ist deshalb die Herbstmess’ Anfang November. Der Christkindlesmarkt kann keinen verkaufsoffenen Sonntag tragen. Das gilt für alle Städte in Baden-Württemberg, nicht nur für Karlsruhe, und auch für Feiertage im Dezember.' },
      { q: 'Was ist bei der Herbstmess’ geöffnet?', a: 'Die Freigabe gilt für das Umfeld des Messplatzes entlang der Durlacher Allee, nicht für die Innenstadt. 2026 ist der Termin am 8. November, 2027 am 7. November, jeweils von 13 bis 18 Uhr. Für 2029 hat die Stadt zusätzlich einen Sonntag zu den World Games beschlossen.' },
    ],
    text: (h) => `<h2>Planung über mehrere Jahre</h2>
<p>Eine Satzung über drei Jahre hat für Besucher einen großen Vorteil: Die Termine stehen früh fest. Karlsruhe bindet sie an Feste, die jedes Jahr am gleichen Wochenende stattfinden, und rechnet die Daten danach. Ändert sich ein Fest, muss die Stadt die Satzung ändern. Bis dahin können Sie sich auf die Termine verlassen, solange die Feste stattfinden.</p>
<p>Im Unterschied zu ${h.a('stadt-stuttgart', 'Stuttgart')}, das jedes Jahr eine neue Allgemeinverfügung erlässt und 2026 zwei Termine widerrufen musste, ist der Karlsruher Kalender stabil. Weitere Städte mit Terminen 2027: ${h.a('termine-2027', 'verkaufsoffene Sonntage 2027')}.</p>`,
  }, {
    slug: 'shopping-sundays-karlsruhe', card: 'Dates adopted up to 2029',
    title: 'Shopping Sundays Karlsruhe 2026 and 2027: every date',
    description: 'Shopping Sundays in Karlsruhe 2026 and 2027: the bylaw’s dates for the centre, Durlach, Mühlburg and the Messplatz fair, and what is adopted up to 2029.',
    h1: 'Shopping Sundays in Karlsruhe',
    intro: 'The finder shows Karlsruhe’s next released Sundays with area and occasion, based on your device’s date.',
    resume: `Karlsruhe plans its shopping Sundays several years ahead. The bylaw for 2024 to 2026 releases the same festivals every year: “Fest der Sinne” in the centre and “Durlach blüht auf” in April, the Mühlburg and Durlach fairs in September, the city festival in the centre in October and the autumn fair at the Messplatz in November, each from 1 pm to 6 pm. In September 2026 the council adopted the dates for 2027 to 2029; the city announced them in a press release, but the new bylaw was not yet available in the city’s law portal on 29 October 2026. That is why ${anz('karlsruhe', 2027)} dates for 2027 are already on the list. Each area stays within the three days Baden-Württemberg allows per town, because the bylaw spreads the festivals over the centre, Durlach, Mühlburg and the Messplatz area. Advent Sundays are barred in the state.`,
    faqs: [
      { q: 'When are shops open on Sunday in Karlsruhe in 2027?', a: 'The council decided in September 2026: 25 April in the centre and Durlach, 12 September in Mühlburg, 19 September in Durlach, 10 October in the centre and 7 November at the Messplatz. The bylaw had not been published by 29 October 2026, but the city has announced the dates.' },
      { q: 'Are shops open in Karlsruhe city centre during Advent?', a: 'No. Baden-Württemberg’s act bars every Advent Sunday and the December holidays. Karlsruhe’s last date of the year is therefore the autumn fair in early November. The Christmas market cannot support a shopping Sunday. This applies to every town in Baden-Württemberg, not only Karlsruhe, and to December holidays as well.' },
      { q: 'What opens for the autumn fair?', a: 'The release covers the area around the Messplatz along Durlacher Allee, not the centre. In 2026 the date is 8 November, in 2027 7 November, each from 1 pm to 6 pm. For 2029 the city has also adopted a Sunday for the World Games.' },
    ],
    text: (h) => `<h2>Planning several years ahead</h2>
<p>A three-year bylaw has a big advantage for visitors: the dates are known early. Karlsruhe ties them to festivals held on the same weekend each year and derives the dates from that. If a festival changes, the city must amend the bylaw. Until then you can rely on the dates, as long as the festivals take place.</p>
<p>Unlike ${h.a('stadt-stuttgart', 'Stuttgart')}, which issues a new general order every year and had to revoke two dates in 2026, Karlsruhe’s calendar is stable. More towns with 2027 dates: ${h.a('termine-2027', 'shopping Sundays 2027')}.</p>`,
  }),

  stadt('duisburg', 62, ['stadt-essen', 'stadt-duesseldorf', 'land-nw'], {
    slug: 'verkaufsoffener-sonntag-duisburg', card: 'City und Ortsteile, eine Verordnung',
    title: 'Verkaufsoffener Sonntag Duisburg 2026: Termine nach Bezirk',
    description: 'Verkaufsoffener Sonntag in Duisburg 2026: alle Termine der Jahresverordnung für die City, Neumühl, Homberg, Meiderich und Rheinhausen, mit Anlass und Uhrzeit.',
    h1: 'Verkaufsoffener Sonntag in Duisburg',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Duisburg mit Bezirk und Anlass, nach dem Datum Ihres Geräts.',
    resume: `Duisburg hat alle verkaufsoffenen Sonntage 2026 in einer einzigen Verordnung zusammengefasst, veröffentlicht im Amtsblatt Nr. 11 vom 31. März 2026, mit Straßenlisten für jeden Bezirk. Die City im Bezirk Mitte öffnet viermal: zum Frühlingsfest im April, zur Automesse „Duisburg in Lack und Chrom“ im September, zum Kürbisfest im Oktober und am 4. Advent, dem 20. Dezember, zum Weihnachtsmarkt. Neumühl im Bezirk Hamborn hat drei Termine, darunter das Revierfest und einen Mittelaltermarkt; Meiderich zwei, Alt-Homberg und Hochemmerich je einen. Alle Termine laufen von 13 bis 18 Uhr. Zusammen sind das ${anz('duisburg', 2026)} Einträge. Bemerkenswert ist der späte Adventstermin: Viele Städte in Nordrhein-Westfalen legen ihren einzigen Adventssonntag auf den 1. oder 2. Advent, Duisburg auf den letzten vor Weihnachten. Für 2027 lag am 29. Oktober 2026 noch keine Verordnung vor.`,
    faqs: [
      { q: 'Ist in Duisburg am 4. Advent verkaufsoffen?', a: 'Ja, in der City im Bezirk Mitte am 20. Dezember 2026 von 13 bis 18 Uhr, zum Weihnachtsmarkt. Es ist der einzige Duisburger Adventssonntag; das Gesetz in Nordrhein-Westfalen erlaubt für ein Gebiet nur einen. Die Ortsteile öffnen im Advent nicht.' },
      { q: 'Welche Duisburger Ortsteile haben verkaufsoffene Sonntage?', a: 'Neben der City sind es 2026 Neumühl im Bezirk Hamborn mit drei Terminen, Meiderich mit zwei sowie Alt-Homberg und Hochemmerich in Rheinhausen mit je einem. Die genauen Straßen stehen in der Verordnung im Amtsblatt, das in der Tabelle verlinkt ist.' },
      { q: 'Hat Duisburg seine Verordnung 2026 geändert?', a: 'Wir haben die Amtsblätter Nr. 1 bis 31 des Jahres 2026 durchgesehen und keine Änderung gefunden. Alle Termine gelten also so, wie sie im März bekannt gemacht wurden. Absagen einzelner Feste würden wir eintragen, sobald die Stadt sie veröffentlicht. Für 2027 ist noch keine neue Verordnung erschienen.' },
    ],
    text: (h) => `<h2>Eine Verordnung für das ganze Jahr</h2>
<p>Duisburg wählt den Gegenweg zu ${h.a('stadt-dortmund', 'Dortmund')}: eine Verordnung für das ganze Jahr, mit allen Bezirken und Straßen. Für Besucher ist das übersichtlich, denn seit März 2026 steht der Kalender fest. Die Stadt nennt für jeden Termin die Straßen, in denen Geschäfte öffnen dürfen, damit klar ist, dass der Anlass das Gebiet prägt.</p>
<p>Die Feste reichen von der Automesse in der City bis zur Traditionsveranstaltung „673 Jahre Neumühl“. Die Zahl der Termine je Gebiet bleibt dabei unter der Grenze des Landes. Weitere Städte am Niederrhein und im Ruhrgebiet: ${h.a('stadt-essen', 'Essen')} und ${h.a('stadt-duesseldorf', 'Düsseldorf')}.</p>`,
  }, {
    slug: 'shopping-sundays-duisburg', card: 'Centre and districts, one ordinance',
    title: 'Shopping Sundays Duisburg 2026: every date by district',
    description: 'Shopping Sundays in Duisburg 2026: every date of the annual ordinance for the centre, Neumühl, Homberg, Meiderich and Rheinhausen, with occasion and hours.',
    h1: 'Shopping Sundays in Duisburg',
    intro: 'The finder shows Duisburg’s next released Sundays with district and occasion, based on your device’s date.',
    resume: `Duisburg put all its 2026 shopping Sundays into a single ordinance, published in official gazette no. 11 of 31 March 2026, with street lists for each district. The centre in the Mitte district opens four times: for the spring festival in April, the “Duisburg in Lack und Chrom” car show in September, the pumpkin festival in October and on the fourth Advent Sunday, 20 December, for the Christmas market. Neumühl in the Hamborn district has three dates, including its Revier festival and a medieval market; Meiderich two, Alt-Homberg and Hochemmerich one each. Every date runs from 1 pm to 6 pm, ${anz('duisburg', 2026)} entries in all. The late Advent date stands out: many North Rhine-Westphalian towns put their single Advent Sunday on the first or second, Duisburg on the last before Christmas. No ordinance for 2027 had appeared by 29 October 2026.`,
    faqs: [
      { q: 'Are shops open in Duisburg on the fourth Advent Sunday?', a: 'Yes, in the centre of the Mitte district on 20 December 2026 from 1 pm to 6 pm, for the Christmas market. It is Duisburg’s only Advent Sunday; North Rhine-Westphalia allows just one per area. The districts do not open in Advent.' },
      { q: 'Which Duisburg districts have shopping Sundays?', a: 'Besides the centre, in 2026 these are Neumühl in Hamborn with three dates, Meiderich with two, and Alt-Homberg and Hochemmerich in Rheinhausen with one each. The exact streets are in the ordinance in the gazette, linked in the table. Every date runs from 1 pm to 6 pm.' },
      { q: 'Has Duisburg amended its 2026 ordinance?', a: 'We checked gazette issues 1 to 31 of 2026 and found no amendment. All dates therefore stand as announced in March. We would add any cancelled festivals as soon as the city publishes them. No new ordinance for 2027 has appeared yet.' },
    ],
    text: (h) => `<h2>One ordinance for the whole year</h2>
<p>Duisburg takes the opposite route to ${h.a('stadt-dortmund', 'Dortmund')}: one ordinance for the whole year, covering every district and street. For visitors that is clear, as the calendar has been fixed since March 2026. For each date the city names the streets where shops may open, to make clear that the occasion shapes the area.</p>
<p>The festivals range from the car show in the centre to the traditional “673 years of Neumühl” event. The number of dates per area stays below the state limit. More towns on the Lower Rhine and in the Ruhr: ${h.a('stadt-essen', 'Essen')} and ${h.a('stadt-duesseldorf', 'Düsseldorf')}.</p>`,
  }),

  stadt('bielefeld', 63, ['land-nw', 'termine-2027', 'stadt-hannover'], {
    slug: 'verkaufsoffener-sonntag-bielefeld', card: 'Dauerverordnung: Termine 2027 stehen fest',
    title: 'Verkaufsoffener Sonntag Bielefeld 2026 und 2027: Termine',
    description: 'Verkaufsoffener Sonntag in Bielefeld 2026 und 2027: Termine der Dauerverordnung für Mitte, Brackwede, Heepen, Sennestadt, Schildesche und Jöllenbeck mit Quelle.',
    h1: 'Verkaufsoffener Sonntag in Bielefeld',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Bielefeld mit Bezirk und Anlass, nach dem Datum Ihres Geräts.',
    resume: `Bielefeld hat eine Dauerverordnung, die nicht Daten, sondern Regeln festlegt: „erster Sonntag im April“, „2. Advent“, „Sonntag des Leinewebermarkts“. Daraus lassen sich die Termine jedes Jahres berechnen, und deshalb stehen für 2027 schon ${anz('bielefeld', 2027)} Termine in der Liste, so viele wie für 2026. Die Innenstadt öffnet zum Straßenkunstfestival „Hut ab!“, zum Leinewebermarkt und am 3. Advent zum Weihnachtsmarkt. Heepen hat vier Termine, darunter einen Adventsmarkt, Brackwede drei, dazu Sennestadt, Schildesche und Jöllenbeck. Alle Termine laufen von 13 bis 18 Uhr. Fällt ein Termin auf Ostersonntag, Pfingstsonntag, den 1. Mai oder den 3. Oktober, gilt nach § 2 der Verordnung der folgende Sonntag; so liegt „Hut ab!“ 2026 am 12. April statt am Ostersonntag. Die Seite des Ordnungsamts nennt Jöllenbeck nicht mehr, die geltende Fassung von 2023 führt den Jürmker Herbstmarkt aber weiter.`,
    faqs: [
      { q: 'Wann ist in Bielefeld 2027 verkaufsoffen?', a: 'Nach der Dauerverordnung in der Innenstadt am 4. April zu „Hut ab!“, am 30. Mai zum Leinewebermarkt und am 12. Dezember zum Weihnachtsmarkt, dazu Termine in Heepen, Brackwede, Sennestadt, Schildesche und Jöllenbeck. Die Daten sind aus den Regeln der Verordnung berechnet; nur der Leinewebermarkt ist mit festem Datum genannt.' },
      { q: 'Warum verschiebt sich „Hut ab!“ 2026?', a: 'Die Verordnung legt das Festival auf den ersten Sonntag im April. 2026 ist das der Ostersonntag, der in Nordrhein-Westfalen gesperrt ist. Für diesen Fall sieht § 2 der Verordnung den folgenden Sonntag vor, deshalb ist die Innenstadt am 12. April geöffnet.' },
      { q: 'Ist in Bielefeld im Advent verkaufsoffen?', a: 'Ja. Brackwede und Heepen öffnen am 2. Advent zu ihren Adventsmärkten, die Innenstadt am 3. Advent zum Weihnachtsmarkt. Weil die Freigaben verschiedene Bezirke betreffen, bleibt Bielefeld innerhalb der Grenze, die das Landesgesetz für Adventssonntage setzt. Alle drei Adventstermine laufen von 13 bis 18 Uhr.' },
    ],
    text: (h) => `<h2>Regeln statt Daten</h2>
<p>Eine Dauerverordnung hat zwei Seiten. Für Besucher ist sie bequem, weil man die Termine Jahre im Voraus kennt. Für die Stadt bedeutet sie, dass die Feste stabil bleiben müssen; ändert sich eines, muss der Rat die Verordnung anpassen. Bielefeld hat sie zuletzt 2023 geändert. Wir berechnen die Termine aus den Regeln und vermerken das in der Quelle.</p>
<p>Weil die Regeln Ostern und Pfingsten berücksichtigen, verschieben sich Frühjahrstermine von Jahr zu Jahr. Prüfen Sie deshalb jeden Termin im Finder, statt ein Datum aus dem Vorjahr zu übernehmen. Andere Städte, deren Termine 2027 schon feststehen: ${h.a('termine-2027', 'Termine 2027')}.</p>`,
  }, {
    slug: 'shopping-sundays-bielefeld', card: 'Standing ordinance: 2027 dates are fixed',
    title: 'Shopping Sundays Bielefeld 2026 and 2027: every date',
    description: 'Shopping Sundays in Bielefeld 2026 and 2027: the standing ordinance’s dates for Mitte, Brackwede, Heepen, Sennestadt, Schildesche and Jöllenbeck, sourced.',
    h1: 'Shopping Sundays in Bielefeld',
    intro: 'The finder shows Bielefeld’s next released Sundays with district and occasion, based on your device’s date.',
    resume: `Bielefeld has a standing ordinance that sets rules rather than dates: “first Sunday in April”, “second Advent Sunday”, “Sunday of the Leineweber market”. The dates of any year follow from that, which is why ${anz('bielefeld', 2027)} dates for 2027 are already on the list, as many as for 2026. The centre opens for the “Hut ab!” street-art festival, the Leineweber market and, on the third Advent Sunday, the Christmas market. Heepen has four dates including an Advent market, Brackwede three, plus Sennestadt, Schildesche and Jöllenbeck. Every date runs from 1 pm to 6 pm. If a date falls on Easter Sunday, Whit Sunday, 1 May or 3 October, section 2 of the ordinance moves it to the following Sunday; so “Hut ab!” is on 12 April 2026 instead of Easter Sunday. The public order office’s page no longer mentions Jöllenbeck, but the current 2023 version still includes the Jöllenbeck autumn market.`,
    faqs: [
      { q: 'When are shops open on Sunday in Bielefeld in 2027?', a: 'Under the standing ordinance, in the centre on 4 April for “Hut ab!”, on 30 May for the Leineweber market and on 12 December for the Christmas market, plus dates in Heepen, Brackwede, Sennestadt, Schildesche and Jöllenbeck. The dates are computed from the ordinance’s rules; only the Leineweber market is given with fixed dates.' },
      { q: 'Why does “Hut ab!” move in 2026?', a: 'The ordinance places the festival on the first Sunday in April. In 2026 that is Easter Sunday, which is barred in North Rhine-Westphalia. For that case section 2 provides for the following Sunday, so the centre opens on 12 April.' },
      { q: 'Are shops open in Bielefeld during Advent?', a: 'Yes. Brackwede and Heepen open on the second Advent Sunday for their Advent markets, the centre on the third for the Christmas market. Because the releases cover different districts, Bielefeld stays within the limit the state act sets for Advent Sundays.' },
    ],
    text: (h) => `<h2>Rules instead of dates</h2>
<p>A standing ordinance cuts both ways. For visitors it is convenient, because the dates are known years ahead. For the city it means the festivals must stay stable; if one changes, the council must amend the ordinance. Bielefeld last amended it in 2023. We compute the dates from the rules and note this with the source.</p>
<p>Because the rules take Easter and Whitsun into account, spring dates shift from year to year. Check each date in the finder rather than reusing last year’s. Other towns whose 2027 dates are already fixed: ${h.a('termine-2027', 'dates 2027')}.</p>`,
  }),

  stadt('landshut', 64, ['stadt-muenchen', 'land-by', 'stadt-nuernberg'], {
    slug: 'verkaufsoffener-sonntag-landshut', card: 'Innenstadt und Nord-West im Frühjahr und Herbst',
    title: 'Verkaufsoffener Sonntag Landshut 2026: Termine und Gebiete',
    description: 'Verkaufsoffener Sonntag in Landshut 2026: die Termine der Stadt für Innenstadt und Gebiet Nord-West, mit Märkten, Uhrzeit ab 13 Uhr und dem Stand für 2027.',
    h1: 'Verkaufsoffener Sonntag in Landshut',
    intro: 'Der Finder zeigt die nächsten freigegebenen Sonntage in Landshut mit Gebiet und Anlass, nach dem Datum Ihres Geräts.',
    resume: `Landshut teilt seine vier verkaufsoffenen Sonntage auf zwei Gebiete auf: die historische Innenstadt und das Gebiet Nord-West mit dem Gewerbegebiet Münchnerau. Für 2026 hat das Stadtmarketing der Stadt vier Termine bekannt gemacht: am 22. März die Frühlingsmärkte in Nord-West, am 3. Mai den Frühjahrsaktionstag mit Antikmarkt in der Innenstadt, am 4. Oktober die Herbstmärkte in Nord-West und am 11. Oktober den Herbstmarkt mit Aktionstag Ehrenamt in der Innenstadt. Die Geschäfte öffnen jeweils ab 13 Uhr, das Rahmenprogramm beginnt früher. Nach dem bayerischen Gesetz darf die Öffnung höchstens fünf zusammenhängende Stunden zwischen 10 und 18 Uhr dauern. Die Rechtsverordnung selbst haben wir auf den Seiten der Stadt nicht gefunden; die Termine stammen aus dem städtischen Portal und den Mitteilungen des Stadtmarketings. Für 2027 ist noch nichts veröffentlicht.`,
    faqs: [
      { q: 'Wann ist in Landshut 2026 verkaufsoffen?', a: 'In der Innenstadt am 3. Mai und am 11. Oktober, im Gebiet Nord-West am 22. März und am 4. Oktober, jeweils ab 13 Uhr. Damit sind die vier Tage, die Bayern je Gemeinde erlaubt, für 2026 ausgeschöpft. Alle Termine des Jahres liegen inzwischen in der Vergangenheit.' },
      { q: 'Was gehört in Landshut zum Gebiet Nord-West?', a: 'Nach Angabe der Stadt das Industrie- und Gewerbegebiet Münchnerau im Nordwesten. Dort liegen vor allem größere Geschäfte, die zu den Frühlings- und Herbstmärkten öffnen. In der Innenstadt bleiben die Geschäfte an diesen beiden Tagen geschlossen, und umgekehrt. Die genauen Grenzen legt die Verordnung der Stadt fest.' },
      { q: 'Gibt es in Landshut einen verkaufsoffenen Sonntag im Advent?', a: 'Für 2026 nicht. Das bayerische Gesetz würde den 1. Advent am 29. November erlauben, weil er im November liegt, aber Landshut hat seine vier Tage bereits im Frühjahr und Herbst vergeben. Die Adventssonntage im Dezember sind in Bayern ohnehin gesperrt.' },
    ],
    text: (h) => `<h2>Zwei Gebiete, je zwei Termine</h2>
<p>Landshut zeigt eine typische Aufteilung für eine mittelgroße Stadt: Die Altstadt mit ihren Fachgeschäften öffnet zu Märkten im Mai und Oktober, das Gewerbegebiet am Stadtrand zu eigenen Frühlings- und Herbstmärkten. So bekommen beide Lagen zwei Sonntage, und die Stadt bleibt bei der Höchstzahl von vier.</p>
<p>Weil die Verordnung nicht online steht, stützen sich die Termine auf das städtische Portal und das Stadtmarketing. Das ist eine amtliche Quelle, aber keine Verordnung im Wortlaut; wir vermerken das in der Tabelle. Andere bayerische Städte: ${h.a('stadt-nuernberg', 'Nürnberg')} und ${h.a('stadt-muenchen', 'München')}.</p>`,
  }, {
    slug: 'shopping-sundays-landshut', card: 'Old town and north-west in spring and autumn',
    title: 'Shopping Sundays Landshut 2026: dates and shopping areas',
    description: 'Shopping Sundays in Landshut 2026: the city’s dates for the old town and the north-west area, with markets, opening from 1 pm, and the position for 2027.',
    h1: 'Shopping Sundays in Landshut',
    intro: 'The finder shows Landshut’s next released Sundays with area and occasion, based on your device’s date.',
    resume: `Landshut splits its four shopping Sundays between two areas: the historic old town and the north-west area with the Münchnerau business park. For 2026 the city’s marketing office announced four dates: 22 March for the spring markets in the north-west, 3 May for the spring day with antiques market in the old town, 4 October for the autumn markets in the north-west, and 11 October for the autumn market with volunteering day in the old town. Shops open from 1 pm each time; the accompanying programme starts earlier. Under the Bavarian act opening may last no more than five consecutive hours between 10 am and 6 pm. We did not find the ordinance itself on the city’s pages; the dates come from the city’s portal and its marketing office’s announcements. Nothing has been published for 2027 yet.`,
    faqs: [
      { q: 'When are shops open on Sunday in Landshut in 2026?', a: 'In the old town on 3 May and 11 October, in the north-west area on 22 March and 4 October, each from 1 pm. That uses up the four days Bavaria allows per municipality for 2026. All of the year’s dates are now in the past.' },
      { q: 'What does Landshut’s north-west area include?', a: 'According to the city, the Münchnerau industrial and business park in the north-west. It is home mainly to larger stores that open for the spring and autumn markets. On those two days the old-town shops stay closed, and vice versa.' },
      { q: 'Is there an Advent shopping Sunday in Landshut?', a: 'Not in 2026. The Bavarian act would allow the first Advent Sunday on 29 November, since it falls in November, but Landshut has already used its four days in spring and autumn. Advent Sundays in December are barred in Bavaria anyway.' },
    ],
    text: (h) => `<h2>Two areas, two dates each</h2>
<p>Landshut shows a typical split for a mid-sized town: the old town with its specialist shops opens for markets in May and October, the business park on the edge of town for its own spring and autumn markets. Both locations get two Sundays, and the town stays at the maximum of four.</p>
<p>Because the ordinance is not online, the dates rest on the city portal and the marketing office. That is an official source, but not the ordinance’s wording; we note this in the table. Other Bavarian cities: ${h.a('stadt-nuernberg', 'Nuremberg')} and ${h.a('stadt-muenchen', 'Munich')}.</p>`,
  }),
];
