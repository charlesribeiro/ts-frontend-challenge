import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deal } from '../../models/deal.model';
import { DealsTableComponent } from './deals-table.component';

const riverside: Deal = {
  id: 'deal-1',
  name: 'Riverside Plaza',
  address: '1200 Riverside Drive, Austin, TX 78704',
  purchasePrice: 4_250_000,
  netOperatingIncome: 297_500,
};

const northgate: Deal = {
  id: 'deal-2',
  name: 'Northgate Business Park',
  address: '850 Northgate Boulevard, Sacramento, CA 95834',
  purchasePrice: 12_800_000,
  netOperatingIncome: 704_000,
};

describe('DealsTableComponent', () => {
  let fixture: ComponentFixture<DealsTableComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DealsTableComponent);
    host = fixture.nativeElement as HTMLElement;
  });

  function render(deals: readonly Deal[], searchTerm = ''): void {
    fixture.componentRef.setInput('deals', deals);
    fixture.componentRef.setInput('searchTerm', searchTerm);
    fixture.detectChanges();
  }

  it('renders a semantic table with the deal columns', () => {
    render([riverside]);

    const columnHeaders = Array.from(host.querySelectorAll('th[scope="col"]')).map((header) =>
      header.textContent?.trim(),
    );

    expect(host.querySelector('table')).not.toBeNull();
    expect(host.querySelector('caption')?.textContent).toContain('Filtered');
    expect(columnHeaders).toEqual(['Name', 'Address', 'Purchase price', 'NOI', 'Cap rate']);
    expect(host.textContent).toContain(riverside.name);
    expect(host.textContent).toContain(riverside.address);
  });

  it('formats currency and cap rate for scanning', () => {
    render([riverside]);

    expect(host.textContent).toContain('$4,250,000');
    expect(host.textContent).toContain('$297,500');
    expect(host.textContent).toContain('7.0%');
  });

  it('highlights matching name segments and keeps markup as literal text', () => {
    const markedUp: Deal = {
      ...riverside,
      name: 'Riverside <img src=x onerror=alert(1)> Plaza',
    };

    render([markedUp], 'plaza');

    const mark = host.querySelector('mark');
    expect(mark?.textContent).toBe('Plaza');
    expect(host.querySelector('img')).toBeNull();
    expect(host.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('shows a status message when no deals match', () => {
    render([]);

    const empty = host.querySelector('.deals-table__empty');
    expect(empty?.getAttribute('role')).toBe('status');
    expect(empty?.textContent).toContain('No deals match the current filters');
  });

  it('keeps a keyboard-reachable horizontal scroll wrapper around the table', () => {
    render([riverside, northgate]);

    const scroll = host.querySelector('.deals-table__scroll');
    expect(scroll).not.toBeNull();
    expect(scroll?.getAttribute('tabindex')).toBe('0');
    expect(scroll?.getAttribute('role')).toBe('region');
    expect(scroll?.getAttribute('aria-label')).toBe('Deal list');
    expect(scroll?.querySelector('table')).not.toBeNull();

    const noiAbbreviation = scroll?.querySelector('table abbr');
    expect(noiAbbreviation?.textContent?.trim()).toBe('NOI');
    expect(noiAbbreviation?.getAttribute('title')).toBe('Net operating income');
  });
});
