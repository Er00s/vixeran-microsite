import { Pipe, PipeTransform } from '@angular/core';

/** Scientific binomial that must always render in italics. */
const SPECIES = 'Azotobacter salinestris';

/**
 * Wraps every occurrence of {@link SPECIES} in `<em class="vx-species">`.
 * Use with `[innerHTML]` after `| translate`.
 */
@Pipe({ name: 'speciesItalic', standalone: true })
export class SpeciesItalicPipe implements PipeTransform {
  transform(value: unknown): string {
    const text = value == null ? '' : String(value);
    if (!text.includes(SPECIES)) {
      return text;
    }
    return text.replaceAll(SPECIES, `<em class="vx-species">${SPECIES}</em>`);
  }
}
