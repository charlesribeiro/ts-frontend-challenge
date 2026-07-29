/**
 * A commercial real-estate investment opportunity.
 *
 * The capitalization rate is deliberately not a field. It is derived from
 * `netOperatingIncome` and `purchasePrice` by `calculateCapRate`, so storing it
 * would let the rate drift out of step with the figures it comes from.
 */
export interface Deal {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  /** Acquisition cost, in whole US dollars. */
  readonly purchasePrice: number;
  /** Annual income after operating expenses, in whole US dollars. */
  readonly netOperatingIncome: number;
}
