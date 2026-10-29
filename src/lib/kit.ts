/**
 * Trousse de rédaction : tout chiffre et toute date écrits dans une page viennent d'ici, jamais tapés à la main.
 *   K.P                         paramètres et sources (params-2026.json)
 *   K.REGELN, K.pruefe, K.jahresbild, K.kirchentage …   règles des 16 lois (engine/regeln.ts)
 *   K.STAEDTE, K.stadtById, K.alleTermine …             décisions des villes (data/staedte.json)
 *   K.feiertage, K.ostersonntag …                        jours fériés (engine/feiertage.ts)
 *   K.tool(kind, lang, args, valeurs)  lance un simulateur de tool-specs.ts et rend sa carte de résultat
 */
import P from '../data/params-2026.json';
import * as F from './engine/feiertage';
import * as R from './engine/regeln';
import * as S from './staedte';
import { runTool, stunden, dShort, dLong, dWeek } from './tool-specs';
import { LAST_UPDATED } from '../data/site-config';

export const KIT = { P, ...F, ...R, ...S, tool: runTool, stunden, dShort, dLong, dWeek, LESEDATUM: LAST_UPDATED };
export type Kit = typeof KIT;
