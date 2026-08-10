import { Correlation } from '../models/weather.model';

/** Narrows an unknown property to a usable number (rejects null and NaN). */
function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Pearson correlation coefficient over the rows where BOTH values are present.
 * Returns `{ r: null }` when there are fewer than three usable pairs, which is
 * how the dashboard decides to print "-" instead of a misleading number.
 */
export function pearson<T extends object>(
  rows: readonly T[],
  xKey: keyof T,
  yKey: keyof T,
): Correlation {
  const pairs: [number, number][] = [];
  for (const row of rows) {
    const x = row[xKey];
    const y = row[yKey];
    if (isFiniteNumber(x) && isFiniteNumber(y)) {
      pairs.push([x, y]);
    }
  }

  const n = pairs.length;
  if (n < 3) {
    return { r: null, n };
  }

  const meanX = pairs.reduce((s, [x]) => s + x, 0) / n;
  const meanY = pairs.reduce((s, [, y]) => s + y, 0) / n;

  let numerator = 0;
  let varX = 0;
  let varY = 0;
  for (const [x, y] of pairs) {
    numerator += (x - meanX) * (y - meanY);
    varX += (x - meanX) ** 2;
    varY += (y - meanY) ** 2;
  }

  const denominator = Math.sqrt(varX * varY);
  return denominator === 0 ? { r: null, n } : { r: numerator / denominator, n };
}

export interface LinearFit {
  slope: number;
  intercept: number;
}

/** Ordinary least squares fit, or null when the X values have no spread. */
export function linearFit(points: readonly (readonly [number, number])[]): LinearFit | null {
  if (points.length < 3) {
    return null;
  }
  const meanX = points.reduce((s, [x]) => s + x, 0) / points.length;
  const meanY = points.reduce((s, [, y]) => s + y, 0) / points.length;

  let numerator = 0;
  let denominator = 0;
  for (const [x, y] of points) {
    numerator += (x - meanX) * (y - meanY);
    denominator += (x - meanX) ** 2;
  }
  if (denominator === 0) {
    return null;
  }
  const slope = numerator / denominator;
  return { slope, intercept: meanY - slope * meanX };
}

/** Strength bucket for an r value - used to colour the correlation caption. */
export function correlationStrength(r: number | null): 'none' | 'weak' | 'positive' | 'negative' {
  if (r === null) {
    return 'none';
  }
  if (Math.abs(r) < 0.2) {
    return 'weak';
  }
  return r > 0 ? 'positive' : 'negative';
}

/** `n` evenly spaced tick values between a and b, inclusive. */
export function ticks(a: number, b: number, count = 4): number[] {
  return Array.from({ length: count + 1 }, (_, i) => a + ((b - a) * i) / count);
}
