/** Toutes les pages prévues (id = nom du fichier de src/content/guides, ou id d'une entrée d'un fichier à plusieurs pages).
 *  Les tests acceptent un lien vers ces ids pendant la rédaction ; « toutes les pages existent » échoue tant qu'il en manque. */
export const LAND_IDS = ['land-bw', 'land-by', 'land-be', 'land-bb', 'land-hb', 'land-hh', 'land-he', 'land-mv', 'land-ni', 'land-nw', 'land-rp', 'land-sl', 'land-sn', 'land-st', 'land-sh', 'land-th'];
export const STADT_IDS = ['stadt-koeln', 'stadt-muenchen', 'stadt-duesseldorf', 'stadt-dortmund', 'stadt-essen', 'stadt-stuttgart', 'stadt-leipzig', 'stadt-dresden', 'stadt-hannover', 'stadt-nuernberg', 'stadt-karlsruhe', 'stadt-duisburg', 'stadt-bielefeld', 'stadt-landshut'];
export const PLANNED_GUIDES = ['heute', 'termine-2026', 'termine-2027', 'advent', 'staedte', 'gesetze', ...LAND_IDS, ...STADT_IDS];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
