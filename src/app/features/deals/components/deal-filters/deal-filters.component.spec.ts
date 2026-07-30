import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMPTY_PRICE_FILTER, PriceFilter } from '../../models/deal-filter.model';
import { DealFiltersComponent } from './deal-filters.component';

describe('DealFiltersComponent', () => {
  let fixture: ComponentFixture<DealFiltersComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DealFiltersComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('searchTerm', '');
    fixture.componentRef.setInput('priceFilter', EMPTY_PRICE_FILTER);
    fixture.detectChanges();
  });

  function requireElement<T extends Element>(selector: string): T {
    const element = host.querySelector<T>(selector);

    if (element === null) {
      throw new Error(`Expected the template to contain ${selector}`);
    }

    return element;
  }

  it('labels the search, comparison and amount controls', () => {
    const priceFieldset = requireElement('.deal-filters__fieldset');

    expect(requireElement('label[for="deal-search"]').textContent).toContain('Search by name');
    expect(priceFieldset.querySelector('legend')?.textContent).toContain('Purchase price');
    expect(priceFieldset.querySelector('#deal-price-comparison')).not.toBeNull();
    expect(priceFieldset.querySelector('#deal-price-amount')).not.toBeNull();
    expect(requireElement('label[for="deal-price-comparison"]').textContent).toContain(
      'Comparison',
    );
    expect(requireElement('label[for="deal-price-amount"]').textContent?.trim()).toBe(
      'Amount in US dollars',
    );
  });

  it('emits the typed search term', () => {
    const emitted: string[] = [];
    fixture.componentInstance.searchTermChange.subscribe((value) => emitted.push(value));

    const input = requireElement<HTMLInputElement>('#deal-search');
    input.value = 'plaza';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toEqual(['plaza']);
  });

  it('emits a price filter when the comparison changes', () => {
    const emitted: PriceFilter[] = [];
    fixture.componentInstance.priceFilterChange.subscribe((value) => emitted.push(value));

    const select = requireElement<HTMLSelectElement>('#deal-price-comparison');
    select.value = 'lessThan';
    select.dispatchEvent(new Event('change'));

    expect(emitted).toEqual([{ comparison: 'lessThan', amount: null }]);
  });

  it('emits a numeric amount, and null when the amount is cleared or negative', () => {
    const emitted: PriceFilter[] = [];
    fixture.componentInstance.priceFilterChange.subscribe((value) => emitted.push(value));

    const amount = requireElement<HTMLInputElement>('#deal-price-amount');
    amount.value = '2500000';
    amount.dispatchEvent(new Event('input'));
    amount.value = '0';
    amount.dispatchEvent(new Event('input'));
    amount.value = '';
    amount.dispatchEvent(new Event('input'));
    amount.value = '-1';
    amount.dispatchEvent(new Event('input'));

    expect(emitted).toEqual([
      { comparison: 'greaterThan', amount: 2_500_000 },
      { comparison: 'greaterThan', amount: 0 },
      { comparison: 'greaterThan', amount: null },
      { comparison: 'greaterThan', amount: null },
    ]);
  });

  it('disables clear until a filter is active, then emits clear', () => {
    const clear = requireElement<HTMLButtonElement>('.deal-filters__clear');
    expect(clear.disabled).toBe(true);

    fixture.componentRef.setInput('priceFilter', { comparison: 'greaterThan', amount: 0 });
    fixture.detectChanges();
    expect(clear.disabled).toBe(false);

    fixture.componentRef.setInput('priceFilter', EMPTY_PRICE_FILTER);
    fixture.componentRef.setInput('searchTerm', 'plaza');
    fixture.detectChanges();
    expect(clear.disabled).toBe(false);

    const emitted: unknown[] = [];
    fixture.componentInstance.clear.subscribe(() => emitted.push(true));
    clear.click();

    expect(emitted).toHaveLength(1);
  });
});
