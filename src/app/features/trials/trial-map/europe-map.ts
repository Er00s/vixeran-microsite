/** Stack Overflow approach: land is GeoJSON polygons; water is the map background. */
export const WORLD_GEOJSON_URL = 'assets/data/world.geojson';

export const MAP_WATER = '#e8f5e9';
export const MAP_LAND_A = '#63b678';
export const MAP_LAND_B = '#a6d785';
export const MAP_BORDER = '#e8f5e9';

export interface EuropeProps {
  iso: string;
  name: string;
  rank: number;
  lx: number | null;
  ly: number | null;
}

const LABEL_OVERRIDES: Readonly<Record<string, string>> = {
  BA: 'Bosnia',
  CZ: 'Czechia',
  MK: 'Macedonia',
  TR: 'Turkiye',
};

export function landFill(iso: string): string {
  const code = iso.charCodeAt(0) + (iso.charCodeAt(1) || 0);
  return code % 2 === 0 ? MAP_LAND_A : MAP_LAND_B;
}

export function landStyle(iso: string): { weight: number; color: string; fillColor: string; fillOpacity: number } {
  return {
    weight: 1.2,
    color: MAP_BORDER,
    fillColor: landFill(iso),
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
