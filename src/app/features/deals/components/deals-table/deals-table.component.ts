import { CurrencyPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Deal } from '../../models/deal.model';
import { HighlightSearchPipe } from '../../pipes/highlight-search.pipe';
import { calculateCapRate } from '../../utils/calculate-cap-rate';

/**
 * Presentational table of deals.
 *
 * Cap rate is derived per row rather than stored on the deal, so the displayed
 * rate cannot drift from the NOI and purchase price it comes from. Search
 * highlighting uses the segment pipe and normal interpolation — never
 * `innerHTML` — so Angular escaping stays intact.
 */
@Component({
  selector: 'app-deals-table',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, HighlightSearchPipe],
  templateUrl: './deals-table.component.html',
  styleUrl: './deals-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsTableComponent {
  readonly deals = input.required<readonly Deal[]>();
  readonly searchTerm = input('');

  capRate(deal: Deal): number {
    return calculateCapRate(deal.netOperatingIncome, deal.purchasePrice);
  }
}
