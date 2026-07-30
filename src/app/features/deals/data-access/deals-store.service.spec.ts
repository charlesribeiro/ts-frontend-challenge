import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { EMPTY_PRICE_FILTER } from '../models/deal-filter.model';
import { Deal } from '../models/deal.model';
import { DEAL_API_REQUEST_ERROR_MESSAGE } from './deal-api.errors';
import { toDealDto } from './deal-test-utils';
import { DealsStoreService } from './deals-store.service';
import { MOCK_DEALS } from './mock-deals';

const dealsUrl = `${environment.apiBaseUrl}/deals`;

const seedDto = toDealDto(MOCK_DEALS[0]);

const addedDeal: Deal = {
  id: 'deal-new',
  name: 'Foxglove Distribution Center',
  address: '18 Foxglove Lane, Reno, NV 89506',
  purchasePrice: 5_000_000,
  netOperatingIncome: 325_000,
};

/** Above every seeded purchase price, so a greater-than filter matches nothing. */
const ABOVE_EVERY_PRICE = 1_000_000_000;

describe('DealsStoreService', () => {
  let store: DealsStoreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(DealsStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushSeed(): void {
    const request = httpMock.expectOne(dealsUrl);
    request.flush([seedDto]);
  }

  it('starts empty with no filters and loads deals from the API', () => {
    expect(store.deals()).toEqual([]);
    expect(store.searchTerm()).toBe('');
    expect(store.priceFilter()).toEqual(EMPTY_PRICE_FILTER);
    expect(store.loading()).toBe(false);

    store.loadDeals();
    expect(store.loading()).toBe(true);

    flushSeed();

    expect(store.loading()).toBe(false);
    expect(store.deals()).toEqual([MOCK_DEALS[0]]);
    expect(store.filteredDeals()).toEqual([MOCK_DEALS[0]]);
    expect(store.loadError()).toBeNull();

    const retained = store.deals()[0] as { name: string };
    expect(() => {
      retained.name = 'mutated';
    }).toThrow();
    expect(store.deals()[0].name).toBe(MOCK_DEALS[0].name);
  });

  it('does not issue a second GET while a successful load has already completed', () => {
    store.loadDeals();
    flushSeed();

    store.loadDeals();
    httpMock.expectNone(dealsUrl);
  });

  it('does not issue a second GET while a load is already in flight', () => {
    store.loadDeals();
    store.loadDeals();

    const requests = httpMock.match(dealsUrl);
    expect(requests).toHaveLength(1);
    requests[0].flush([seedDto]);
  });

  it('surfaces a load error and retries successfully', () => {
    store.loadDeals();
    httpMock.expectOne(dealsUrl).flush('boom', { status: 500, statusText: 'Server Error' });

    expect(store.loadError()).toBe(DEAL_API_REQUEST_ERROR_MESSAGE);
    expect(store.deals()).toEqual([]);

    store.retryLoad();
    flushSeed();

    expect(store.loadError()).toBeNull();
    expect(store.deals()).toEqual([MOCK_DEALS[0]]);
  });

  it('exposes state as read-only signals', () => {
    expect('set' in store.deals).toBe(false);
    expect('set' in store.searchTerm).toBe(false);
    expect('set' in store.priceFilter).toBe(false);
    expect('set' in store.loading).toBe(false);
    expect('set' in store.creating).toBe(false);
    expect('set' in store.loadError).toBe(false);
    expect('set' in store.createError).toBe(false);
  });

  it('narrows the filtered deals when a search term is set', () => {
    store.loadDeals();
    flushSeed();

    store
      .createDeal({
        name: addedDeal.name,
        address: addedDeal.address,
        purchasePrice: addedDeal.purchasePrice,
        netOperatingIncome: addedDeal.netOperatingIncome,
      })
      .subscribe();

    httpMock.expectOne(dealsUrl).flush(toDealDto(addedDeal));

    store.setSearchTerm('foxglove');

    expect(store.filteredDeals()).toEqual([addedDeal]);
  });

  it('narrows the filtered deals when a price filter is set', () => {
    store.loadDeals();
    flushSeed();

    store.setPriceFilter({ comparison: 'greaterThan', amount: ABOVE_EVERY_PRICE });

    expect(store.filteredDeals()).toEqual([]);
  });

  it('copies the price filter, so a later caller mutation cannot reach the store', () => {
    const callerFilter = { comparison: 'greaterThan' as const, amount: 1_000_000 };

    store.setPriceFilter(callerFilter);
    callerFilter.amount = ABOVE_EVERY_PRICE;

    expect(store.priceFilter().amount).toBe(1_000_000);
  });

  it('keeps every deal even while the filters match none of them', () => {
    store.loadDeals();
    flushSeed();

    store.setSearchTerm('no such deal');
    store.setPriceFilter({ comparison: 'greaterThan', amount: ABOVE_EVERY_PRICE });

    expect(store.filteredDeals()).toEqual([]);
    expect(store.deals()).toEqual([MOCK_DEALS[0]]);
  });

  it('appends a deal only after a successful POST', () => {
    store.loadDeals();
    flushSeed();
    const before = store.deals();

    let emitted: Deal | undefined;
    store
      .createDeal({
        name: addedDeal.name,
        address: addedDeal.address,
        purchasePrice: addedDeal.purchasePrice,
        netOperatingIncome: addedDeal.netOperatingIncome,
      })
      .subscribe((deal) => {
        emitted = deal;
      });

    expect(store.creating()).toBe(true);
    expect(store.deals()).toBe(before);

    httpMock.expectOne(dealsUrl).flush(toDealDto(addedDeal));

    expect(store.creating()).toBe(false);
    expect(emitted).toEqual(addedDeal);
    expect(store.deals()).not.toBe(before);
    expect(store.deals()).toEqual([MOCK_DEALS[0], addedDeal]);
    expect(store.createError()).toBeNull();
  });

  it('ignores a second create while one is already in flight', () => {
    store.loadDeals();
    flushSeed();

    const input = {
      name: addedDeal.name,
      address: addedDeal.address,
      purchasePrice: addedDeal.purchasePrice,
      netOperatingIncome: addedDeal.netOperatingIncome,
    };

    let firstEmitted = false;
    let secondEmitted = false;
    let secondCompleted = false;
    let secondErrored = false;

    store.createDeal(input).subscribe(() => {
      firstEmitted = true;
    });
    store.createDeal(input).subscribe({
      next: () => {
        secondEmitted = true;
      },
      error: () => {
        secondErrored = true;
      },
      complete: () => {
        secondCompleted = true;
      },
    });

    const requests = httpMock.match(dealsUrl);
    expect(requests).toHaveLength(1);
    requests[0].flush(toDealDto(addedDeal));

    expect(firstEmitted).toBe(true);
    expect(secondEmitted).toBe(false);
    expect(secondErrored).toBe(false);
    expect(secondCompleted).toBe(true);
    expect(store.deals()).toEqual([MOCK_DEALS[0], addedDeal]);
  });

  it('keeps the list unchanged and sets createError when POST fails', () => {
    store.loadDeals();
    flushSeed();
    const before = store.deals();
    let emitted = false;
    let completed = false;

    store
      .createDeal({
        name: addedDeal.name,
        address: addedDeal.address,
        purchasePrice: addedDeal.purchasePrice,
        netOperatingIncome: addedDeal.netOperatingIncome,
      })
      .subscribe({
        next: () => {
          emitted = true;
        },
        complete: () => {
          completed = true;
        },
      });

    httpMock.expectOne(dealsUrl).flush('boom', { status: 500, statusText: 'Server Error' });

    expect(emitted).toBe(false);
    expect(completed).toBe(true);
    expect(store.deals()).toEqual(before);
    expect(store.createError()).toBe(DEAL_API_REQUEST_ERROR_MESSAGE);
    expect(store.creating()).toBe(false);
  });

  it('clears the search term and price filter together', () => {
    store.loadDeals();
    flushSeed();

    store.setSearchTerm('plaza');
    store.setPriceFilter({ comparison: 'lessThan', amount: 5_000_000 });

    store.clearFilters();

    expect(store.searchTerm()).toBe('');
    expect(store.priceFilter()).toEqual(EMPTY_PRICE_FILTER);
    expect(store.filteredDeals()).toEqual([MOCK_DEALS[0]]);
  });
});
