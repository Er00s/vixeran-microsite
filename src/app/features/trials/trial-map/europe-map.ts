/** Stack Overflow approach: land is GeoJSON polygons; water is the map background. */
export const WORLD_GEOJSON_URL = 'assets/data/world.geojson';
/** Natural Earth admin-1 (states/provinces), shown when zoom >= REGIONS_MIN_ZOOM. */
export const REGIONS_GEOJSON_URL = 'assets/data/world-regions.geojson';
export const REGIONS_MIN_ZOOM = 5;
/** Region name labels appear a bit later than the regional polygons. */
export const REGION_LABEL_MIN_ZOOM = 6;

export const MAP_WATER = '#e8f5e9';
export const MAP_LAND_A = '#63b678';
export const MAP_LAND_B = '#a6d785';
export const MAP_LAND_C = '#7ec48a';
/** Soft edge at low zoom (against water). */
export const MAP_BORDER = '#cfe8d4';
/** Stronger country outline once regions are visible. */
export const MAP_COUNTRY_BORDER = '#0f5132';
export const MAP_REGION_BORDER = '#d4edda';

export interface EuropeProps {
  iso: string;
  name: string;
  rank: number;
  lx: number | null;
  ly: number | null;
}

export interface RegionProps {
  id: string;
  name: string;
  iso: string;
}

/** Populated from world-regions.geojson after load — countries with admin-1 polygons. */
export const regionIsos = new Set<string>();

export function setRegionIsos(isos: Iterable<string>): void {
  regionIsos.clear();
  for (const iso of isos) {
    regionIsos.add(iso);
  }
}

const LABEL_OVERRIDES: Readonly<Record<string, string>> = {
  BA: 'Bosnia',
  CZ: 'Czechia',
  MK: 'Macedonia',
  TR: 'Turkiye',
};

const REGION_FILLS = [MAP_LAND_A, MAP_LAND_B, MAP_LAND_C] as const;

export function landFill(iso: string): string {
  const code = iso.charCodeAt(0) + (iso.charCodeAt(1) || 0);
  return code % 2 === 0 ? MAP_LAND_A : MAP_LAND_B;
}

export function regionFill(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 997;
  }
  return REGION_FILLS[hash % REGION_FILLS.length];
}

export function landStyle(
  iso: string,
  zoom = 4,
): { weight: number; color: string; fillColor: string; fillOpacity: number; opacity: number } {
  const showRegions = zoom >= REGIONS_MIN_ZOOM && regionIsos.has(iso);
  return {
    weight: showRegions ? 2.6 : zoom >= 4 ? 1.6 : 1.2,
    color: showRegions ? MAP_COUNTRY_BORDER : MAP_BORDER,
    opacity: 1,
    fillColor: landFill(iso),
    fillOpacity: showRegions ? 0 : 1,
  };
}

export function regionStyle(
  id: string,
): { weight: number; color: string; fillColor: string; fillOpacity: number } {
  return {
    weight: 0.75,
    color: MAP_REGION_BORDER,
    fillColor: regionFill(id),
    fillOpacity: 1,
  };
}

export function labelFor(iso: string, name: string): string {
  return (LABEL_OVERRIDES[iso] ?? name).toUpperCase();
}

export function labelVisible(rank: number, zoom: number): boolean {
  if (rank <= 2) {
    return zoom >= 2;
  }
  if (rank <= 3) {
    return zoom >= 3.5;
  }
  if (rank <= 4) {
    return zoom >= 5;
  }
  return zoom >= 6.5;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
