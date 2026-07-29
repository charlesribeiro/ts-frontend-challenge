import { Pipe, PipeTransform } from '@angular/core';

/** A run of text that either matches the current search term or does not. */
export interface HighlightSegment {
  readonly text: string;
  readonly match: boolean;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Splits text into matching and non-matching segments so a template can render
 * the matches inside `<mark>` through normal interpolation.
 *
 * Returning segments rather than an HTML string keeps Angular's default
 * escaping intact: no `[innerHTML]` binding and no `bypassSecurityTrustHtml`.
 *
 * ```html
 * @for (segment of deal.name | highlightSearch: query; track $index) {
 *   @if (segment.match) { <mark>{{ segment.text }}</mark> } @else { {{ segment.text }} }
 * }
 * ```
 */
@Pipe({
  name: 'highlightSearch',
  standalone: true,
})
export class HighlightSearchPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    search: string | null | undefined,
  ): HighlightSegment[] {
    const text = value ?? '';
    const term = search?.trim() ?? '';

    if (!text) {
      return [];
    }

    if (!term) {
      return [{ text, match: false }];
    }

    const segments: HighlightSegment[] = [];
    const pattern = new RegExp(escapeRegExp(term), 'gi');
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > cursor) {
        segments.push({ text: text.slice(cursor, match.index), match: false });
      }
      segments.push({ text: match[0], match: true });
      cursor = match.index + match[0].length;
    }

    if (cursor < text.length) {
      segments.push({ text: text.slice(cursor), match: false });
    }

    return segments;
  }
}
