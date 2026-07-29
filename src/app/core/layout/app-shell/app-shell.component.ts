import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {}
