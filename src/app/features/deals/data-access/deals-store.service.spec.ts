import { TestBed } from '@angular/core/testing';

import { EMPTY_PRICE_FILTER } from '../models/deal-filter.model';
import { Deal } from '../models/deal.model';
import { DealsStoreService } from './deals-store.service';
import { MOCK_DEALS } from './mock-deals';

/** Priced and named so it cannot collide with the seed data. */
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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(DealsStoreService);
  });

  it('is created with the mock deals as its source of truth', () => {
    expect(store).toBeInstanceOf(DealsStoreService);
    expect(store.deals()).toEqual(MOCK_DEALS);
  });

  it('starts with no filters applied', () => {
    expect(store.searchTerm()).toBe('');
    expect(store.priceFilter()).toEqual(EMPTY_PRICE_FILTER);
    expect(store.filteredDeals()).toEqual(MOCK_DEALS);
  });

  it('exposes state as read-only signals', () => {
    expect('set' in store.deals).toBe(false);
    expect('set' in store.searchTerm).toBe(false);
    expect('set' in store.priceFilter).toBe(false);
  });

  it('narrows the filtered deals when a search term is set', () => {
    store.addDeal(addedDeal);

    store.setSearchTerm('foxglove');

    expect(store.filteredDeals()).toEqual([addedDeal]);
  });

  it('narrows the filtered deals when a price filter is set', () => {
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
    store.setSearchTerm('no such deal');
    store.setPriceFilter({ comparison: 'greaterThan', amount: ABOVE_EVERY_PRICE });

    expect(store.filteredDeals()).toEqual([]);
    expect(store.deals()).toEqual(MOCK_DEALS);
  });

  it('adds a deal by replacing the array rather than mutating it', () => {
    const before = store.deals();

    store.addDeal(addedDeal);

    expect(before).toEqual(MOCK_DEALS);
    expect(store.deals()).not.toBe(before);
    expect(store.deals()).toEqual([...MOCK_DEALS, addedDeal]);
  });

  it('copies an added deal, so a later caller mutation cannot reach the store', () => {
    const callerDeal = { ...addedDeal };

    store.addDeal(callerDeal);
    callerDeal.name = 'Renamed After Being Added';

    expect(store.deals().at(-1)?.name).toBe(addedDeal.name);
  });

  it('recomputes the filtered deals when a matching deal is added', () => {
    store.setSearchTerm('foxglove');
    expect(store.filteredDeals()).toEqual([]);

    store.addDeal(addedDeal);

    expect(store.filteredDeals()).toEqual([addedDeal]);
  });

  it('leaves the filtered deals alone when a deal outside the filters is added', () => {
    store.setSearchTerm('riverside');
    const filteredBefore = store.filteredDeals();

    store.addDeal(addedDeal);

    expect(store.filteredDeals()).toEqual(filteredBefore);
  });

  it('clears the search term and price filter together', () => {
    store.setSearchTerm('plaza');
    store.setPriceFilter({ comparison: 'lessThan', amount: 5_000_000 });

    store.clearFilters();

    expect(store.searchTerm()).toBe('');
    expect(store.priceFilter()).toEqual(EMPTY_PRICE_FILTER);
    expect(store.filteredDeals()).toEqual(MOCK_DEALS);
  });
});
