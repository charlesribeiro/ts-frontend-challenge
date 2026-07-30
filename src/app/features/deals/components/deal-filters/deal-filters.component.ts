import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { PriceComparison, PriceFilter } from '../../models/deal-filter.model';

/**
 * Presentational filter bar for the deals dashboard.
 *
 * Owns no store state of its own: the page pushes the current criteria in and
 * receives every change back out, so the same controls stay reusable in tests
 * without standing up `DealsStoreService`.
 */
@Component({
  selector: 'app-deal-filters',
  standalone: true,
  imports: [],
  templateUrl: './deal-filters.component.html',
  styleUrl: './deal-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealFiltersComponent {
  readonly searchTerm = input('');
  readonly priceFilter = input.required<PriceFilter>();

  readonly searchTermChange = output<string>();
  readonly priceFilterChange = output<PriceFilter>();
  readonly clear = output<void>();

  readonly filtersActive = computed(() => {
    const amount = this.priceFilter().amount;

    return this.searchTerm().trim() !== '' || amount !== null;
  });

  onSearchInput(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.searchTermChange.emit(target.value);
  }

  onComparisonChange(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    this.priceFilterChange.emit({
      comparison: target.value as PriceComparison,
      amount: this.priceFilter().amount,
    });
  }

  onAmountInput(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const raw = target.value.trim();
    const parsed = raw === '' ? Number.NaN : Number(raw);
    const amount = Number.isFinite(parsed) && parsed >= 0 ? parsed : null;

    this.priceFilterChange.emit({
      comparison: this.priceFilter().comparison,
      amount,
    });
  }

  onClear(): void {
    this.clear.emit();
  }
}
