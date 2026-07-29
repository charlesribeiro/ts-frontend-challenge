import { Deal } from '../models/deal.model';

/**
 * Seed data for the in-memory store.
 *
 * Prices span roughly $2.7M to $24M and cap rates 5.5% to 8.5%, so both price
 * comparisons return a meaningful subset instead of everything or nothing. Two
 * names share the word "Park" and two share "view", which gives the search and
 * its highlighting something to match on more than one row.
 */
export const MOCK_DEALS: readonly Deal[] = [
  {
    id: 'deal-1',
    name: 'Riverside Plaza',
    address: '1200 Riverside Drive, Austin, TX 78704',
    purchasePrice: 4_250_000,
    netOperatingIncome: 297_500,
  },
  {
    id: 'deal-2',
    name: 'Northgate Business Park',
    address: '850 Northgate Boulevard, Sacramento, CA 95834',
    purchasePrice: 12_800_000,
    netOperatingIncome: 704_000,
  },
  {
    id: 'deal-3',
    name: 'Lakeview Apartments',
    address: '415 Lakeview Terrace, Madison, WI 53703',
    purchasePrice: 6_900_000,
    netOperatingIncome: 448_500,
  },
  {
    id: 'deal-4',
    name: 'Harborview Logistics Center',
    address: '2400 Harbor Road, Savannah, GA 31408',
    purchasePrice: 18_500_000,
    netOperatingIncome: 1_202_500,
  },
  {
    id: 'deal-5',
    name: 'Elmwood Retail Center',
    address: '77 Elmwood Avenue, Buffalo, NY 14201',
    purchasePrice: 3_150_000,
    netOperatingIncome: 236_250,
  },
  {
    id: 'deal-6',
    name: 'Cedar Park Medical Offices',
    address: '9010 Cedar Park Way, Charlotte, NC 28277',
    purchasePrice: 8_400_000,
    netOperatingIncome: 504_000,
  },
  {
    id: 'deal-7',
    name: 'Summit Ridge Self Storage',
    address: '1450 Summit Ridge Road, Denver, CO 80211',
    purchasePrice: 2_750_000,
    netOperatingIncome: 233_750,
  },
  {
    id: 'deal-8',
    name: 'Bayfront Tower',
    address: '300 Bayfront Parkway, Tampa, FL 33602',
    purchasePrice: 24_000_000,
    netOperatingIncome: 1_320_000,
  },
];
