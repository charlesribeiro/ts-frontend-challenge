import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppShellComponent } from './app-shell.component';

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();
  });

  it('renders its template', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('app-shell works!');
  });
});
