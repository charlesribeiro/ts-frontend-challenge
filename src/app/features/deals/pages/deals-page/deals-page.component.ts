import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [],
  templateUrl: './deals-page.component.html',
  styleUrl: './deals-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsPageComponent {}
