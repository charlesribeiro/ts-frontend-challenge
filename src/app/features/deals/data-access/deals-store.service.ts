import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, defer, EMPTY, finalize, Observable, tap } from 'rxjs';

import { CreateDealInput } from '../models/create-deal-input.model';
import { EMPTY_PRICE_FILTER, PriceFilter } from '../models/deal-filter.model';
import { Deal } from '../models/deal.model';
import { filterDeals } from '../utils/filter-deals';
import { DealApiRequestError, DealApiValidationError } from './deal-api.errors';
import { DealsApiService } from './deals-api.service';

/**
 * Single source of truth for deals and the filters applied to them.
 *
 * Deals are loaded and created through `DealsApiService`. Writable signals stay
 * private; consumers read the exposed read-only signals. Filters remain
 * client-side over the loaded collection via `filteredDeals`.
 *
 * Create is pessimistic: the local list updates only after a successful POST.
 * Incoming values are copied and frozen on the way in so callers cannot mutate
 * stored state through a retained reference.
 */
@Injectable({
  providedIn: 'root',
})
export class DealsStoreService {
  private readonly api = inject(DealsApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly dealsState = signal<readonly Deal[]>([]);
  private readonly searchTermState = signal('');
  private readonly priceFilterState = signal<PriceFilter>(EMPTY_PRICE_FILTER);
  private readonly loadingState = signal(false);
  private readonly creatingState = signal(false);
  private readonly loadErrorState = signal<string | null>(null);
  private readonly createErrorState = signal<string | null>(null);

  private loadInFlight = false;
  private createInFlight = false;
  private hasLoaded = false;

  readonly deals = this.dealsState.asReadonly();
  readonly searchTerm = this.searchTermState.asReadonly();
  readonly priceFilter = this.priceFilterState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly creating = this.creatingState.asReadonly();
  readonly loadError = this.loadErrorState.asReadonly();
  readonly createError = this.createErrorState.asReadonly();

  readonly filteredDeals = computed(() =>
    filterDeals(this.deals(), this.searchTerm(), this.priceFilter()),
  );

  /**
   * Loads deals once. Concurrent or repeat calls are no-ops until `retryLoad`
   * clears the loaded flag after a failure or an explicit retry.
   */
  loadDeals(): void {
    if (this.loadInFlight || this.hasLoaded) {
      return;
    }

    this.loadInFlight = true;
    this.loadingState.set(true);
    this.loadErrorState.set(null);

    this.api
      .getDeals()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loadInFlight = false;
          this.loadingState.set(false);
        }),
      )
      .subscribe({
        next: (deals) => {
          this.dealsState.set(deals.map((deal) => Object.freeze({ ...deal })));
          this.hasLoaded = true;
        },
        error: (error: unknown) => {
          this.loadErrorState.set(this.messageFor(error));
        },
      });
  }

  /** Clears the successful-load latch and loads again. */
  retryLoad(): void {
    this.hasLoaded = false;
    this.loadDeals();
  }

  setSearchTerm(searchTerm: string): void {
    this.searchTermState.set(searchTerm);
  }

  setPriceFilter(priceFilter: PriceFilter): void {
    this.priceFilterState.set({ ...priceFilter });
  }

  /**
   * POSTs a deal and appends it only after the server responds with a valid
   * body. Emits the created deal to subscribers; on failure sets `createError`
   * and completes without emitting. Concurrent calls while a create is in
   * flight are ignored.
   */
  createDeal(input: CreateDealInput): Observable<Deal> {
    return defer(() => {
      if (this.createInFlight) {
        return EMPTY;
      }

      this.createInFlight = true;
      this.creatingState.set(true);
      this.createErrorState.set(null);

      return this.api.createDeal(input).pipe(
        tap((deal) => {
          this.dealsState.update((deals) => [...deals, Object.freeze({ ...deal })]);
        }),
        catchError((error: unknown) => {
          this.createErrorState.set(this.messageFor(error));

          return EMPTY;
        }),
        finalize(() => {
          this.createInFlight = false;
          this.creatingState.set(false);
        }),
      );
    });
  }

  clearFilters(): void {
    this.searchTermState.set('');
    this.priceFilterState.set(EMPTY_PRICE_FILTER);
  }

  private messageFor(error: unknown): string {
    if (error instanceof DealApiValidationError || error instanceof DealApiRequestError) {
      return error.message;
    }

    return new DealApiRequestError().message;
  }
}
