import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DealFiltersComponent } from '../../components/deal-filters/deal-filters.component';
import { DealsTableComponent } from '../../components/deals-table/deals-table.component';
import { DealsStoreService } from '../../data-access/deals-store.service';
import { PriceFilter } from '../../models/deal-filter.model';

/** Dashboard page: wires the filter bar and table to the deals store. */
@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [DealFiltersComponent, DealsTableComponent],
  templateUrl: './deals-page.component.html',
  styleUrl: './deals-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsPageComponent {
  private readonly store = inject(DealsStoreService);

  readonly searchTerm = this.store.searchTerm;
  readonly priceFilter = this.store.priceFilter;
  readonly filteredDeals = this.store.filteredDeals;

  onSearchTermChange(searchTerm: string): void {
    this.store.setSearchTerm(searchTerm);
  }

  onPriceFilterChange(priceFilter: PriceFilter): void {
    this.store.setPriceFilter(priceFilter);
  }

  onClearFilters(): void {
    this.store.clearFilters();
  }
}
