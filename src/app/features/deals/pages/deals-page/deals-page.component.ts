import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DealFiltersComponent } from '../../components/deal-filters/deal-filters.component';
import { DealFormComponent } from '../../components/deal-form/deal-form.component';
import { DealsTableComponent } from '../../components/deals-table/deals-table.component';
import { DealsStoreService } from '../../data-access/deals-store.service';
import { PriceFilter } from '../../models/deal-filter.model';
import { Deal } from '../../models/deal.model';

/** Dashboard page: wires filters, the creation form, and the table to the store. */
@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [DealFiltersComponent, DealFormComponent, DealsTableComponent],
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

  onDealCreated(deal: Deal): void {
    this.store.addDeal(deal);
  }
}
