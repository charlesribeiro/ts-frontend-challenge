import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../../../environments/environment';
import { DEAL_API_REQUEST_ERROR_MESSAGE } from '../../data-access/deal-api.errors';
import { toDealDto } from '../../data-access/deal-test-utils';
import { DealsStoreService } from '../../data-access/deals-store.service';
import { MOCK_DEALS } from '../../data-access/mock-deals';
import { EMPTY_PRICE_FILTER } from '../../models/deal-filter.model';
import { DealsPageComponent } from './deals-page.component';

const dealsUrl = `${environment.apiBaseUrl}/deals`;

describe('DealsPageComponent', () => {
  let fixture: ComponentFixture<DealsPageComponent>;
  let host: HTMLElement;
  let store: DealsStoreService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealsPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    store = TestBed.inject(DealsStoreService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DealsPageComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushDeals(deals: readonly (typeof MOCK_DEALS)[number][] = MOCK_DEALS): void {
    httpMock.expectOne(dealsUrl).flush(deals.map(toDealDto));
    fixture.detectChanges();
  }

  function requireElement<T extends Element>(selector: string): T {
    const element = host.querySelector<T>(selector);

    if (element === null) {
      throw new Error(`Expected the template to contain ${selector}`);
    }

    return element;
  }

  it('shows a loading status until deals arrive', () => {
    expect(host.textContent).toContain('Loading deals…');
    expect(host.querySelector('app-deals-table')).toBeNull();

    flushDeals();

    expect(host.querySelector('app-deal-filters')).not.toBeNull();
    expect(host.querySelector('app-deals-table')).not.toBeNull();
    expect(host.querySelector('app-deal-form')).not.toBeNull();
    expect(host.textContent).toContain(MOCK_DEALS[0].name);
  });

  it('shows a load error with retry', () => {
    httpMock.expectOne(dealsUrl).flush('boom', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(host.textContent).toContain(DEAL_API_REQUEST_ERROR_MESSAGE);
    requireElement<HTMLButtonElement>('.deals-page__retry').click();
    flushDeals([MOCK_DEALS[0]]);

    expect(host.textContent).not.toContain(DEAL_API_REQUEST_ERROR_MESSAGE);
    expect(host.textContent).toContain(MOCK_DEALS[0].name);
  });

  it('shows an empty pipeline message when the API returns no deals', () => {
    flushDeals([]);

    expect(host.textContent).toContain('No deals yet');
    expect(host.querySelector('app-deals-table')).toBeNull();
    expect(host.querySelector('app-deal-form')).not.toBeNull();
  });

  it('narrows the table when the search control changes', () => {
    flushDeals();

    const search = requireElement<HTMLInputElement>('#deal-search');
    search.value = 'riverside';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(store.searchTerm()).toBe('riverside');
    expect(host.textContent).toMatch(/Riverside\s+Plaza/);
    expect(host.textContent).not.toContain('Bayfront Tower');
  });

  it('narrows the table when a price threshold is entered', () => {
    flushDeals();
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
    flushDeals();

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

  it('adds a submitted deal to the store and the table after POST succeeds', () => {
    flushDeals();

    const fill = (selector: string, value: string): void => {
      const input = requireElement<HTMLInputElement>(selector);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };

    fill('#deal-name', 'Foxglove Distribution Center');
    fill('#deal-address', '18 Foxglove Lane, Reno, NV 89506');
    fill('#deal-purchase-price', '5000000');
    fill('#deal-noi', '325000');
    requireElement<HTMLFormElement>('app-deal-form form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    httpMock.expectOne(dealsUrl).flush({
      id: 'deal-new',
      name: 'Foxglove Distribution Center',
      address: '18 Foxglove Lane, Reno, NV 89506',
      purchasePrice: 5_000_000,
      netOperatingIncome: 325_000,
    });
    fixture.detectChanges();

    expect(store.deals().at(-1)?.name).toBe('Foxglove Distribution Center');
    expect(host.textContent).toMatch(/Foxglove\s+Distribution\s+Center/);
    expect(requireElement('[role="status"]').textContent).toContain('Added Foxglove');
  });

  it('lets a newly created deal pass through the active search filter', () => {
    flushDeals();

    const search = requireElement<HTMLInputElement>('#deal-search');
    search.value = 'foxglove';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.textContent).toContain('No deals match the current filters');

    const fill = (selector: string, value: string): void => {
      const input = requireElement<HTMLInputElement>(selector);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };

    fill('#deal-name', 'Foxglove Distribution Center');
    fill('#deal-address', '18 Foxglove Lane, Reno, NV 89506');
    fill('#deal-purchase-price', '5000000');
    fill('#deal-noi', '325000');
    requireElement<HTMLFormElement>('app-deal-form form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    httpMock.expectOne(dealsUrl).flush({
      id: 'deal-new',
      name: 'Foxglove Distribution Center',
      address: '18 Foxglove Lane, Reno, NV 89506',
      purchasePrice: 5_000_000,
      netOperatingIncome: 325_000,
    });
    fixture.detectChanges();

    expect(host.textContent).toMatch(/Foxglove\s+Distribution\s+Center/);
    expect(host.querySelector('.deals-table__empty')).toBeNull();
  });
});
