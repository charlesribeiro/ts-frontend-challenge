import { PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { map, startWith } from 'rxjs';

import { CreateDealInput } from '../../models/create-deal-input.model';
import { calculateCapRate } from '../../utils/calculate-cap-rate';

/** Treats whitespace-only strings as missing, matching how values are stored after trim. */
function requiredTrimmed(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (typeof value !== 'string' || value.trim().length === 0) {
      return { required: true };
    }

    return null;
  };
}

/**
 * Presentational form for creating a deal.
 *
 * Cap rate is derived on the fly from the financial fields — never stored on
 * the emitted payload — so the live preview cannot disagree with what the table
 * will show after the server accepts the create.
 *
 * The form emits a create request without an `id`. The parent runs the
 * pessimistic POST; call `confirmCreated` only after success so values stay put
 * on failure and the success status is honest.
 */
@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [ReactiveFormsModule, PercentPipe],
  templateUrl: './deal-form.component.html',
  styleUrl: './deal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly creating = input(false);
  readonly createError = input<string | null>(null);
  readonly createRequested = output<CreateDealInput>();

  private readonly statusMessageState = signal<string | null>(null);

  readonly statusMessage = this.statusMessageState.asReadonly();

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [requiredTrimmed()]],
    address: ['', [requiredTrimmed()]],
    purchasePrice: [0, [Validators.required, Validators.min(0.01)]],
    netOperatingIncome: [0, [Validators.required, Validators.min(0)]],
  });

  readonly previewCapRate = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
      map(() => {
        const { netOperatingIncome, purchasePrice } = this.form.getRawValue();

        return calculateCapRate(netOperatingIncome, purchasePrice);
      }),
    ),
    { initialValue: 0 },
  );

  nameInvalid(): boolean {
    const control = this.form.controls.name;

    return control.touched && control.invalid;
  }

  addressInvalid(): boolean {
    const control = this.form.controls.address;

    return control.touched && control.invalid;
  }

  purchasePriceInvalid(): boolean {
    const control = this.form.controls.purchasePrice;

    return control.touched && control.invalid;
  }

  netOperatingIncomeInvalid(): boolean {
    const control = this.form.controls.netOperatingIncome;

    return control.touched && control.invalid;
  }

  submit(): void {
    this.statusMessageState.set(null);

    if (this.creating()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalidControl();

      return;
    }

    const { name, address, purchasePrice, netOperatingIncome } = this.form.getRawValue();

    this.createRequested.emit({
      name: name.trim(),
      address: address.trim(),
      purchasePrice,
      netOperatingIncome,
    });
  }

  /** Resets the form and announces success after the store confirms persistence. */
  confirmCreated(name: string): void {
    this.form.reset({
      name: '',
      address: '',
      purchasePrice: 0,
      netOperatingIncome: 0,
    });
    this.statusMessageState.set(`Added ${name}.`);
  }

  private focusFirstInvalidControl(): void {
    const controlId = this.form.controls.name.invalid
      ? 'deal-name'
      : this.form.controls.address.invalid
        ? 'deal-address'
        : this.form.controls.purchasePrice.invalid
          ? 'deal-purchase-price'
          : this.form.controls.netOperatingIncome.invalid
            ? 'deal-noi'
            : null;

    if (controlId === null) {
      return;
    }

    const control = this.host.nativeElement.querySelector(`#${controlId}`);

    if (control instanceof HTMLElement) {
      control.focus();
    }
  }
}
