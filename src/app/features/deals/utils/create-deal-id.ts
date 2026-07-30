/**
 * Creates an opaque deal identifier.
 *
 * Prefers `crypto.randomUUID` when the runtime provides it. Falls back to a
 * timestamp-based id for environments such as older jsdom builds that expose
 * `crypto` without `randomUUID`.
 */
export function createDealId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `deal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
