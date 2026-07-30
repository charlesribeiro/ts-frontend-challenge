import { mapCreateDealInputToBody, mapDealDtoToDeal } from './deal.mapper';
import { dealDtoListSchema, dealDtoSchema } from './deal.schema';

describe('deal.schema', () => {
  it('accepts the documented MockAPI sample shape', () => {
    const parsed = dealDtoSchema.safeParse({
      id: '1',
      name: 'Downtown Commercial Plaza',
      address: '100 Market Street',
      purchasePrice: 15_000_000,
      netOperatingIncome: 1_200_000,
    });

    expect(parsed.success).toBe(true);
  });

  it('coerces id and numeric strings', () => {
    const parsed = dealDtoSchema.safeParse({
      id: 7,
      name: 'A',
      address: 'B',
      purchasePrice: '100',
      netOperatingIncome: '10',
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual({
        id: '7',
        name: 'A',
        address: 'B',
        purchasePrice: 100,
        netOperatingIncome: 10,
      });
    }
  });

  it.each([
    ['purchasePrice', ''],
    ['purchasePrice', ' '],
    ['purchasePrice', 'Infinity'],
    ['purchasePrice', 'NaN'],
    ['purchasePrice', null],
    ['purchasePrice', true],
    ['purchasePrice', false],
    ['netOperatingIncome', ''],
    ['netOperatingIncome', ' '],
    ['netOperatingIncome', 'Infinity'],
    ['netOperatingIncome', 'NaN'],
    ['netOperatingIncome', null],
    ['netOperatingIncome', true],
    ['netOperatingIncome', false],
    ['id', null],
    ['id', {}],
    ['name', ''],
    ['name', ' '],
    ['address', ''],
    ['address', ' '],
  ] as const)('rejects malformed %s value %p', (field, value) => {
    const parsed = dealDtoSchema.safeParse({
      id: '1',
      name: 'A',
      address: 'B',
      purchasePrice: 100,
      netOperatingIncome: 10,
      [field]: value,
    });

    expect(parsed.success).toBe(false);
  });

  it('accepts a valid list of deal DTOs', () => {
    const parsed = dealDtoListSchema.safeParse([
      {
        id: '1',
        name: 'Downtown Commercial Plaza',
        address: '100 Market Street',
        purchasePrice: 15_000_000,
        netOperatingIncome: 1_200_000,
      },
      {
        id: 2,
        name: 'Second Deal',
        address: '200 Market Street',
        purchasePrice: '500000',
        netOperatingIncome: '25000',
      },
    ]);

    expect(parsed.success).toBe(true);
  });

  it('rejects a non-array list payload', () => {
    expect(dealDtoListSchema.safeParse({}).success).toBe(false);
  });
});

describe('deal.mapper', () => {
  it('maps a DTO onto the domain deal', () => {
    expect(
      mapDealDtoToDeal({
        id: '1',
        name: 'Downtown Commercial Plaza',
        address: '100 Market Street',
        purchasePrice: 15_000_000,
        netOperatingIncome: 1_200_000,
      }),
    ).toEqual({
      id: '1',
      name: 'Downtown Commercial Plaza',
      address: '100 Market Street',
      purchasePrice: 15_000_000,
      netOperatingIncome: 1_200_000,
    });
  });

  it('maps a create input to a body without an id', () => {
    expect(
      mapCreateDealInputToBody({
        name: 'Foxglove',
        address: '18 Foxglove Lane',
        purchasePrice: 5_000_000,
        netOperatingIncome: 325_000,
      }),
    ).toEqual({
      name: 'Foxglove',
      address: '18 Foxglove Lane',
      purchasePrice: 5_000_000,
      netOperatingIncome: 325_000,
    });
  });
});
