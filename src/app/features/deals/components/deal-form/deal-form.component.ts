import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [],
  templateUrl: './deal-form.component.html',
  styleUrl: './deal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealFormComponent {}
