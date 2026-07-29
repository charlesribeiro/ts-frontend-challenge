import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-deals-table',
  standalone: true,
  imports: [],
  templateUrl: './deals-table.component.html',
  styleUrl: './deals-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsTableComponent {}
