/** Direction of the purchase-price comparison the user selects. */
export type PriceComparison = 'greaterThan' | 'lessThan';

/**
 * Purchase-price filter criteria.
 *
 * A `null` amount means no threshold has been entered, which leaves the filter
 * inactive. That keeps "the user picked a comparison but has not typed a
 * number" distinct from "the user filtered on 0".
 */
export interface PriceFilter {
  readonly comparison: PriceComparison;
  readonly amount: number | null;
}

/** Starting point for the price filter: a default comparison, no threshold. */
export const EMPTY_PRICE_FILTER: PriceFilter = {
  comparison: 'greaterThan',
  amount: null,
};
