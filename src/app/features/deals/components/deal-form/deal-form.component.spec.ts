import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deal } from '../../models/deal.model';
import { DealFormComponent } from './deal-form.component';

describe('DealFormComponent', () => {
  let fixture: ComponentFixture<DealFormComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DealFormComponent);
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

  function fill(selector: string, value: string): void {
    const input = requireElement<HTMLInputElement>(selector);

    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function submit(): void {
    requireElement<HTMLFormElement>('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  function fillValidDeal(overrides: Partial<Record<string, string>> = {}): void {
    fill('#deal-name', overrides['name'] ?? 'Foxglove Distribution Center');
    fill('#deal-address', overrides['address'] ?? '18 Foxglove Lane, Reno, NV 89506');
    fill('#deal-purchase-price', overrides['purchasePrice'] ?? '5000000');
    fill('#deal-noi', overrides['netOperatingIncome'] ?? '325000');
  }

  it('labels every financial and text control', () => {
    expect(requireElement('label[for="deal-name"]').textContent).toContain('Name');
    expect(requireElement('label[for="deal-address"]').textContent).toContain('Address');
    expect(requireElement('label[for="deal-purchase-price"]').textContent).toContain(
      'Purchase price',
    );
    expect(requireElement('label[for="deal-noi"]').textContent).toContain('Net operating income');
  });

  it('shows validation messages and focuses the first invalid field on empty submit', () => {
    submit();

    expect(host.textContent).toContain('Enter a deal name.');
    expect(host.textContent).toContain('Enter an address.');
    expect(host.textContent).toContain('Enter a purchase price greater than zero.');
    expect(document.activeElement).toBe(requireElement('#deal-name'));
  });

  it('rejects whitespace-only name and address', () => {
    fillValidDeal({ name: '   ', address: '   ' });
    submit();

    expect(host.textContent).toContain('Enter a deal name.');
    expect(host.textContent).toContain('Enter an address.');
  });

  it('rejects a non-positive purchase price and a negative NOI', () => {
    fillValidDeal({ purchasePrice: '0', netOperatingIncome: '-1' });
    submit();

    expect(host.textContent).toContain('Enter a purchase price greater than zero.');
    expect(host.textContent).toContain('Enter a net operating income of zero or more.');
  });

  it('updates the live cap rate as the financial fields change', () => {
    fill('#deal-purchase-price', '1000');
    fill('#deal-noi', '50');
    fixture.detectChanges();

    expect(host.textContent).toContain('5.0%');
  });

  it('emits a trimmed deal with a unique id and resets the form', () => {
    const emitted: Deal[] = [];
    fixture.componentInstance.dealCreated.subscribe((deal) => emitted.push(deal));

    fillValidDeal({
      name: '  Foxglove Distribution Center  ',
      address: '  18 Foxglove Lane, Reno, NV 89506  ',
    });
    submit();

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual(
      expect.objectContaining({
        name: 'Foxglove Distribution Center',
        address: '18 Foxglove Lane, Reno, NV 89506',
        purchasePrice: 5_000_000,
        netOperatingIncome: 325_000,
      }),
    );
    expect(emitted[0].id.length).toBeGreaterThan(0);

    expect(requireElement<HTMLInputElement>('#deal-name').value).toBe('');
    expect(requireElement<HTMLInputElement>('#deal-address').value).toBe('');
    expect(requireElement<HTMLInputElement>('#deal-purchase-price').value).toBe('0');
    expect(requireElement<HTMLInputElement>('#deal-noi').value).toBe('0');
  });

  it('does not emit when the form is invalid', () => {
    const emitted: Deal[] = [];
    fixture.componentInstance.dealCreated.subscribe((deal) => emitted.push(deal));

    fill('#deal-name', 'Only a name');
    submit();

    expect(emitted).toHaveLength(0);
  });
});
