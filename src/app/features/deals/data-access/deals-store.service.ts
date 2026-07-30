import { computed, Injectable, signal } from '@angular/core';

import { EMPTY_PRICE_FILTER, PriceFilter } from '../models/deal-filter.model';
import { Deal } from '../models/deal.model';
import { filterDeals } from '../utils/filter-deals';
import { MOCK_DEALS } from './mock-deals';

/**
 * Single source of truth for the deals and the filters applied to them.
 *
 * The writable signals stay private so state only ever changes through the
 * methods below, and consumers read the exposed read-only signals instead.
 *
 * `filteredDeals` is derived on read rather than kept in a signal of its own, so
 * it cannot fall out of step with the deals or the filters: adding a deal or
 * changing a filter is enough to update it.
 *
 * Incoming values are copied on the way in. `readonly` properties only stop
 * mutation through a reference of that type, so a caller keeping hold of the
 * object it passed could otherwise edit stored state without a signal being
 * written, leaving the derived list stale. Both shapes are flat, so a shallow
 * copy is a complete one.
 */
@Injectable({
  providedIn: 'root',
})
export class DealsStoreService {
  private readonly dealsState = signal<readonly Deal[]>(MOCK_DEALS);
  private readonly searchTermState = signal('');
  private readonly priceFilterState = signal<PriceFilter>(EMPTY_PRICE_FILTER);

  readonly deals = this.dealsState.asReadonly();
  readonly searchTerm = this.searchTermState.asReadonly();
  readonly priceFilter = this.priceFilterState.asReadonly();

  readonly filteredDeals = computed(() =>
    filterDeals(this.deals(), this.searchTerm(), this.priceFilter()),
  );

  setSearchTerm(searchTerm: string): void {
    this.searchTermState.set(searchTerm);
  }

  setPriceFilter(priceFilter: PriceFilter): void {
    this.priceFilterState.set({ ...priceFilter });
  }

  addDeal(deal: Deal): void {
    this.dealsState.update((deals) => [...deals, { ...deal }]);
  }

  clearFilters(): void {
    this.searchTermState.set('');
    this.priceFilterState.set(EMPTY_PRICE_FILTER);
  }
}
