import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-deal-filters',
  standalone: true,
  imports: [],
  templateUrl: './deal-filters.component.html',
  styleUrl: './deal-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealFiltersComponent {}
