import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearch',
  standalone: true,
})
export class HighlightSearchPipe implements PipeTransform {
  transform(_value: unknown, ..._args: unknown[]): unknown {
    return null;
  }
}
