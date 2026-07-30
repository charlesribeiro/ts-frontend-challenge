/** Thrown when the HTTP body fails Zod validation at the deals API boundary. */
export class DealApiValidationError extends Error {
  constructor(message = 'The server returned deal data in an unexpected format.') {
    super(message);
    this.name = 'DealApiValidationError';
  }
}

/** Default user-facing copy when a deals request fails for a network or HTTP reason. */
export const DEAL_API_REQUEST_ERROR_MESSAGE =
  'Could not reach the deals service. Please try again.';

/** Thrown when the deals request fails for a network or HTTP reason. */
export class DealApiRequestError extends Error {
  constructor(message = DEAL_API_REQUEST_ERROR_MESSAGE) {
    super(message);
    this.name = 'DealApiRequestError';
  }
}
