import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsStoreService } from '../../data-access/deals-store.service';
import { MOCK_DEALS } from '../../data-access/mock-deals';
import { EMPTY_PRICE_FILTER } from '../../models/deal-filter.model';
import { DealsPageComponent } from './deals-page.component';

describe('DealsPageComponent', () => {
  let fixture: ComponentFixture<DealsPageComponent>;
  let host: HTMLElement;
  let store: DealsStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealsPageComponent],
    }).compileComponents();

    store = TestBed.inject(DealsStoreService);
    fixture = TestBed.createComponent(DealsPageComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function requireElement<T extends Element>(selector: string): T {
    const element = host.querySelector<T>(selector);

    if (element === null) {
      throw new Error(`Expected the template to contain ${selector}`);
    }

    return element;
  }

  it('renders the filter bar and the deals table', () => {
    expect(host.querySelector('app-deal-filters')).not.toBeNull();
    expect(host.querySelector('app-deals-table')).not.toBeNull();
    expect(host.textContent).toContain(MOCK_DEALS[0].name);
  });

  it('narrows the table when the search control changes', () => {
    const search = requireElement<HTMLInputElement>('#deal-search');
    search.value = 'riverside';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(store.searchTerm()).toBe('riverside');
    expect(host.textContent).toMatch(/Riverside\s+Plaza/);
    expect(host.textContent).not.toContain('Bayfront Tower');
  });

  it('narrows the table when a price threshold is entered', () => {
    const bayfront = MOCK_DEALS.find((deal) => deal.name === 'Bayfront Tower');

    if (bayfront === undefined) {
      throw new Error('Expected Bayfront Tower in the seed data');
    }

    const comparison = requireElement<HTMLSelectElement>('#deal-price-comparison');
    comparison.value = 'lessThan';
    comparison.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const amount = requireElement<HTMLInputElement>('#deal-price-amount');
    // Exact purchase price: lessThan must exclude the equality case (not <=).
    amount.value = String(bayfront.purchasePrice);
    amount.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(store.priceFilter()).toEqual({
      comparison: 'lessThan',
      amount: bayfront.purchasePrice,
    });
    expect(host.textContent).toMatch(/Riverside\s+Plaza/);
    expect(host.textContent).not.toMatch(/Bayfront\s+Tower/);
  });

  it('shows the empty state when nothing matches, then restores on clear', () => {
    const search = requireElement<HTMLInputElement>('#deal-search');
    search.value = 'no such deal';
    search.dispatchEvent(new Event('input'));

    const amount = requireElement<HTMLInputElement>('#deal-price-amount');
    amount.value = '1000000';
    amount.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.textContent).toContain('No deals match the current filters');

    requireElement<HTMLButtonElement>('.deal-filters__clear').click();
    fixture.detectChanges();

    expect(store.searchTerm()).toBe('');
    expect(store.priceFilter()).toEqual(EMPTY_PRICE_FILTER);
    expect(requireElement<HTMLInputElement>('#deal-search').value).toBe('');
    expect(requireElement<HTMLInputElement>('#deal-price-amount').value).toBe('');
    expect(host.textContent).toMatch(/Riverside\s+Plaza/);
    expect(host.querySelector('.deals-table__empty')).toBeNull();
  });
});
