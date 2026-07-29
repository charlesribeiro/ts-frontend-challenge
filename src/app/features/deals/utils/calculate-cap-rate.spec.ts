import { calculateCapRate } from './calculate-cap-rate';

describe('calculateCapRate', () => {
  it('divides net operating income by purchase price', () => {
    expect(calculateCapRate(297_500, 4_250_000)).toBe(0.07);
  });

  it('returns a ratio rather than a percentage', () => {
    expect(calculateCapRate(50, 1000)).toBe(0.05);
  });

  it('returns 0 when net operating income is 0', () => {
    expect(calculateCapRate(0, 1_000_000)).toBe(0);
  });

  it('returns 0 when the purchase price is 0, rather than Infinity', () => {
    expect(calculateCapRate(100_000, 0)).toBe(0);
  });

  it('returns 0 for a negative purchase price', () => {
    expect(calculateCapRate(100_000, -1)).toBe(0);
  });

  it('returns 0 for negative net operating income', () => {
    expect(calculateCapRate(-1, 1_000_000)).toBe(0);
  });

  it('returns 0 when two finite figures divide into an overflow', () => {
    expect(calculateCapRate(Number.MAX_VALUE, Number.MIN_VALUE)).toBe(0);
  });

  it('returns 0 when either figure is not a finite number', () => {
    expect(calculateCapRate(Number.NaN, 1_000_000)).toBe(0);
    expect(calculateCapRate(100_000, Number.NaN)).toBe(0);
    expect(calculateCapRate(Number.POSITIVE_INFINITY, 1_000_000)).toBe(0);
    expect(calculateCapRate(100_000, Number.POSITIVE_INFINITY)).toBe(0);
    expect(calculateCapRate(Number.NEGATIVE_INFINITY, 1_000_000)).toBe(0);
    expect(calculateCapRate(100_000, Number.NEGATIVE_INFINITY)).toBe(0);
  });
});
