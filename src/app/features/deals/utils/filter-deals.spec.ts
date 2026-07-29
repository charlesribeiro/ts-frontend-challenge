import { EMPTY_PRICE_FILTER, PriceFilter } from '../models/deal-filter.model';
import { Deal } from '../models/deal.model';
import { filterDeals } from './filter-deals';

const riversidePlaza: Deal = {
  id: 'deal-1',
  name: 'Riverside Plaza',
  address: '1200 Riverside Drive, Austin, TX 78704',
  purchasePrice: 1_000_000,
  netOperatingIncome: 70_000,
};

const cedarParkOffices: Deal = {
  id: 'deal-2',
  name: 'Cedar Park Medical Offices',
  address: '9010 Cedar Park Way, Charlotte, NC 28277',
  purchasePrice: 2_000_000,
  netOperatingIncome: 120_000,
};

const northgateBusinessPark: Deal = {
  id: 'deal-3',
  name: 'Northgate Business Park',
  address: '850 Northgate Boulevard, Sacramento, CA 95834',
  purchasePrice: 3_000_000,
  netOperatingIncome: 165_000,
};

const deals: readonly Deal[] = [riversidePlaza, cedarParkOffices, northgateBusinessPark];

function priceFilter(overrides: Partial<PriceFilter>): PriceFilter {
  return { ...EMPTY_PRICE_FILTER, ...overrides };
}

describe('filterDeals', () => {
  it('returns every deal when no filter is applied', () => {
    expect(filterDeals(deals, '', EMPTY_PRICE_FILTER)).toEqual(deals);
  });

  it('leaves the source array untouched', () => {
    filterDeals(deals, 'plaza', priceFilter({ amount: 500_000 }));

    expect(deals).toEqual([riversidePlaza, cedarParkOffices, northgateBusinessPark]);
  });

  describe('search term', () => {
    it('matches the deal name case-insensitively', () => {
      expect(filterDeals(deals, 'PLAZA', EMPTY_PRICE_FILTER)).toEqual([riversidePlaza]);
    });

    it('matches on a partial name', () => {
      expect(filterDeals(deals, 'river', EMPTY_PRICE_FILTER)).toEqual([riversidePlaza]);
    });

    it('ignores surrounding whitespace', () => {
      expect(filterDeals(deals, '   plaza   ', EMPTY_PRICE_FILTER)).toEqual([riversidePlaza]);
    });

    it('treats a whitespace-only term as no search', () => {
      expect(filterDeals(deals, '   ', EMPTY_PRICE_FILTER)).toEqual(deals);
    });

    it('keeps every deal whose name contains the term', () => {
      expect(filterDeals(deals, 'park', EMPTY_PRICE_FILTER)).toEqual([
        cedarParkOffices,
        northgateBusinessPark,
      ]);
    });

    it('returns nothing when no name matches', () => {
      expect(filterDeals(deals, 'warehouse', EMPTY_PRICE_FILTER)).toEqual([]);
    });

    it('does not search the address', () => {
      expect(filterDeals(deals, 'Austin', EMPTY_PRICE_FILTER)).toEqual([]);
    });
  });

  describe('price filter', () => {
    it('keeps deals priced above the threshold', () => {
      const result = filterDeals(
        deals,
        '',
        priceFilter({ comparison: 'greaterThan', amount: 1_500_000 }),
      );

      expect(result).toEqual([cedarParkOffices, northgateBusinessPark]);
    });

    it('keeps deals priced below the threshold', () => {
      const result = filterDeals(
        deals,
        '',
        priceFilter({ comparison: 'lessThan', amount: 2_500_000 }),
      );

      expect(result).toEqual([riversidePlaza, cedarParkOffices]);
    });

    it('excludes a deal priced exactly at a greater-than threshold', () => {
      const result = filterDeals(
        deals,
        '',
        priceFilter({ comparison: 'greaterThan', amount: 2_000_000 }),
      );

      expect(result).toEqual([northgateBusinessPark]);
    });

    it('excludes a deal priced exactly at a less-than threshold', () => {
      const result = filterDeals(
        deals,
        '',
        priceFilter({ comparison: 'lessThan', amount: 2_000_000 }),
      );

      expect(result).toEqual([riversidePlaza]);
    });

    it('stays inactive while no amount has been entered', () => {
      expect(filterDeals(deals, '', priceFilter({ amount: null }))).toEqual(deals);
    });

    it('stays inactive for an amount that is not a finite number', () => {
      expect(filterDeals(deals, '', priceFilter({ amount: Number.NaN }))).toEqual(deals);
    });

    it('filters on an amount of 0 rather than ignoring it', () => {
      const result = filterDeals(deals, '', priceFilter({ comparison: 'lessThan', amount: 0 }));

      expect(result).toEqual([]);
    });
  });

  it('applies the search term and the price filter together', () => {
    const result = filterDeals(
      deals,
      'park',
      priceFilter({ comparison: 'greaterThan', amount: 2_500_000 }),
    );

    expect(result).toEqual([northgateBusinessPark]);
  });

  it('returns nothing when the filters have no overlap', () => {
    const result = filterDeals(
      deals,
      'plaza',
      priceFilter({ comparison: 'greaterThan', amount: 2_500_000 }),
    );

    expect(result).toEqual([]);
  });
});
