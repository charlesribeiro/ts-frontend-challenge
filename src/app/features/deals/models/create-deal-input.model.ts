/**
 * Fields required to create a deal. The server assigns `id`; the client must
 * not invent one for persisted creates.
 */
export interface CreateDealInput {
  readonly name: string;
  readonly address: string;
  readonly purchasePrice: number;
  readonly netOperatingIncome: number;
}
