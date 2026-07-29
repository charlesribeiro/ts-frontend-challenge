/**
 * Capitalization rate as a decimal ratio, so 0.075 means 7.5%.
 *
 * Returns 0 instead of throwing, `Infinity` or `NaN` when the figures cannot
 * produce a rate, which keeps callers free of guard clauses: the table and the
 * live preview in the creation form always have a number to format. Inputs from
 * a number input can be `NaN`, and two finite figures can still divide into an
 * overflow, so the quotient is screened as well as the inputs.
 */
export function calculateCapRate(netOperatingIncome: number, purchasePrice: number): number {
  if (!Number.isFinite(netOperatingIncome) || !Number.isFinite(purchasePrice)) {
    return 0;
  }

  if (purchasePrice <= 0 || netOperatingIncome < 0) {
    return 0;
  }

  const capRate = netOperatingIncome / purchasePrice;

  return Number.isFinite(capRate) ? capRate : 0;
}
