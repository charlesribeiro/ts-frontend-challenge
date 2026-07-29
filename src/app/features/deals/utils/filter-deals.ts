import { PriceFilter } from '../models/deal-filter.model';
import { Deal } from '../models/deal.model';

function matchesSearch(deal: Deal, normalizedTerm: string): boolean {
  if (!normalizedTerm) {
    return true;
  }

  return deal.name.toLowerCase().includes(normalizedTerm);
}

function matchesPrice(deal: Deal, { comparison, amount }: PriceFilter): boolean {
  if (amount === null || !Number.isFinite(amount)) {
    return true;
  }

  return comparison === 'greaterThan' ? deal.purchasePrice > amount : deal.purchasePrice < amount;
}

/**
 * Narrows deals to those matching both the search term and the price filter.
 *
 * The search runs against the deal name only, case-insensitively, and ignores
 * surrounding whitespace so a stray space while typing does not empty the table.
 *
 * Price comparisons are strict, so a deal priced at exactly the threshold is
 * excluded by both directions. An amount that is absent or not a finite number
 * leaves the price filter inactive rather than matching nothing, which keeps a
 * half-typed threshold from looking like a table with no results.
 */
export function filterDeals(
  deals: readonly Deal[],
  searchTerm: string,
  priceFilter: PriceFilter,
): readonly Deal[] {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  return deals.filter(
    (deal) => matchesSearch(deal, normalizedTerm) && matchesPrice(deal, priceFilter),
  );
}
