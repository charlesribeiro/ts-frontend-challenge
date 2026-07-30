import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEAL_API_REQUEST_ERROR_MESSAGE } from '../../data-access/deal-api.errors';
import { CreateDealInput } from '../../models/create-deal-input.model';
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

  it('emits a trimmed create payload without an id and keeps values until confirmed', () => {
    const emitted: CreateDealInput[] = [];
    fixture.componentInstance.createRequested.subscribe((input) => emitted.push(input));

    fillValidDeal({
      name: '  Foxglove Distribution Center  ',
      address: '  18 Foxglove Lane, Reno, NV 89506  ',
    });
    submit();

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual({
      name: 'Foxglove Distribution Center',
      address: '18 Foxglove Lane, Reno, NV 89506',
      purchasePrice: 5_000_000,
      netOperatingIncome: 325_000,
    });
    expect(emitted[0]).not.toHaveProperty('id');

    expect(requireElement<HTMLInputElement>('#deal-name').value).toBe(
      '  Foxglove Distribution Center  ',
    );
    expect(host.querySelector('[role="status"]')).toBeNull();
  });

  it('resets and announces success only when confirmCreated is called', () => {
    fillValidDeal();
    fixture.componentInstance.confirmCreated('Foxglove Distribution Center');
    fixture.detectChanges();

    expect(requireElement<HTMLInputElement>('#deal-name').value).toBe('');
    expect(requireElement<HTMLInputElement>('#deal-address').value).toBe('');
    expect(requireElement<HTMLInputElement>('#deal-purchase-price').value).toBe('0');
    expect(requireElement<HTMLInputElement>('#deal-noi').value).toBe('0');
    expect(requireElement('[role="status"]').textContent?.trim()).toBe(
      'Added Foxglove Distribution Center.',
    );
  });

  it('rejects a whitespace-only name while the other fields are valid', () => {
    const emitted: CreateDealInput[] = [];
    fixture.componentInstance.createRequested.subscribe((input) => emitted.push(input));

    fillValidDeal({ name: '   ' });
    submit();

    expect(emitted).toHaveLength(0);
    expect(host.textContent).toContain('Enter a deal name.');
    expect(fixture.componentInstance.form.controls.name.invalid).toBe(true);
    expect(host.querySelector('[role="status"]')).toBeNull();
  });

  it('clears the success status when a later invalid submit is attempted', () => {
    fixture.componentInstance.confirmCreated('Foxglove Distribution Center');
    fixture.detectChanges();
    expect(requireElement('[role="status"]').textContent).toContain('Added');

    fill('#deal-name', '');
    submit();

    expect(host.querySelector('[role="status"]')).toBeNull();
  });

  it('does not emit when the form is invalid', () => {
    const emitted: CreateDealInput[] = [];
    fixture.componentInstance.createRequested.subscribe((input) => emitted.push(input));

    fill('#deal-name', 'Only a name');
    submit();

    expect(emitted).toHaveLength(0);
  });

  it('does not emit when submit is dispatched while creating', () => {
    const emitted: CreateDealInput[] = [];
    fixture.componentInstance.createRequested.subscribe((input) => emitted.push(input));

    fillValidDeal();
    fixture.componentRef.setInput('creating', true);
    fixture.detectChanges();

    submit();

    expect(emitted).toHaveLength(0);
  });

  it('marks submit as aria-disabled and shows the create error from the parent', () => {
    fixture.componentRef.setInput('creating', true);
    fixture.componentRef.setInput('createError', DEAL_API_REQUEST_ERROR_MESSAGE);
    fixture.detectChanges();

    expect(requireElement('.deal-form__fieldset').getAttribute('aria-disabled')).toBe('true');
    expect(requireElement<HTMLInputElement>('#deal-name').readOnly).toBe(true);

    const submitButton = requireElement<HTMLButtonElement>('.deal-form__submit');
    expect(submitButton.disabled).toBe(false);
    expect(submitButton.getAttribute('aria-disabled')).toBe('true');
    expect(host.textContent).toContain('Saving…');
    expect(requireElement('[role="alert"]').textContent).toContain(DEAL_API_REQUEST_ERROR_MESSAGE);
  });

  it('keeps the create error visible and re-enables submit after a failed create', () => {
    fixture.componentRef.setInput('creating', false);
    fixture.componentRef.setInput('createError', DEAL_API_REQUEST_ERROR_MESSAGE);
    fixture.detectChanges();

    const submitButton = requireElement<HTMLButtonElement>('.deal-form__submit');
    expect(submitButton.disabled).toBe(false);
    expect(submitButton.getAttribute('aria-disabled')).toBeNull();
    expect(submitButton.textContent?.trim()).toBe('Add deal');
    expect(requireElement('[role="alert"]').textContent).toContain(DEAL_API_REQUEST_ERROR_MESSAGE);
  });
});
