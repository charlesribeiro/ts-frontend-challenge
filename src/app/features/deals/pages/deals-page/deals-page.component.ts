import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DealFiltersComponent } from '../../components/deal-filters/deal-filters.component';
import { DealFormComponent } from '../../components/deal-form/deal-form.component';
import { DealsTableComponent } from '../../components/deals-table/deals-table.component';
import { DealsStoreService } from '../../data-access/deals-store.service';
import { CreateDealInput } from '../../models/create-deal-input.model';
import { PriceFilter } from '../../models/deal-filter.model';

/** Dashboard page: wires filters, the creation form, and the table to the store. */
@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [DealFiltersComponent, DealFormComponent, DealsTableComponent],
  templateUrl: './deals-page.component.html',
  styleUrl: './deals-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsPageComponent implements OnInit {
  private readonly store = inject(DealsStoreService);
  private readonly destroyRef = inject(DestroyRef);

  readonly deals = this.store.deals;
  readonly searchTerm = this.store.searchTerm;
  readonly priceFilter = this.store.priceFilter;
  readonly filteredDeals = this.store.filteredDeals;
  readonly loading = this.store.loading;
  readonly loadError = this.store.loadError;
  readonly creating = this.store.creating;
  readonly createError = this.store.createError;

  ngOnInit(): void {
    this.store.loadDeals();
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.setSearchTerm(searchTerm);
  }

  onPriceFilterChange(priceFilter: PriceFilter): void {
    this.store.setPriceFilter(priceFilter);
  }

  onClearFilters(): void {
    this.store.clearFilters();
  }

  onRetryLoad(): void {
    this.store.retryLoad();
  }

  onCreateRequested(input: CreateDealInput, form: DealFormComponent): void {
    this.store
      .createDeal(input)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deal) => {
          form.confirmCreated(deal.name);
        },
        error: () => {
          // Failures are already mapped onto `createError` by the store.
        },
      });
  }
}
