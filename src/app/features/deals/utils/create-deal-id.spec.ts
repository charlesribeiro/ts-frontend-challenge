import { createDealId } from './create-deal-id';

describe('createDealId', () => {
  const originalCryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');

  afterEach(() => {
    jest.restoreAllMocks();

    if (originalCryptoDescriptor === undefined) {
      Reflect.deleteProperty(globalThis, 'crypto');
    } else {
      Object.defineProperty(globalThis, 'crypto', originalCryptoDescriptor);
    }
  });

  it('returns the identifier from crypto.randomUUID when available', () => {
    const randomUUID = jest.fn(() => '11111111-2222-3333-4444-555555555555');

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: { randomUUID },
    });

    expect(createDealId()).toBe('11111111-2222-3333-4444-555555555555');
    expect(randomUUID).toHaveBeenCalledTimes(1);
  });

  it('falls back to a deal-prefixed id when randomUUID is unavailable', () => {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {},
    });
    jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    expect(createDealId()).toBe(
      `deal-${(1_700_000_000_000).toString(36)}-${(0.123456789).toString(36).slice(2, 10)}`,
    );
  });
});
