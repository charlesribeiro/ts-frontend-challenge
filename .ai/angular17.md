# Angular 17 Guidelines

This project targets Angular 17. All generated or modified code must use Angular 17-compatible APIs and conventions.

## Components

- Use standalone components.
- Do not create Angular modules.
- Set `ChangeDetectionStrategy.OnPush` on components.
- Keep page components responsible for orchestration.
- Keep presentational components focused on inputs, outputs, and rendering.
- Import only the dependencies required by each standalone component.

Example:

```ts
@Component({
  selector: 'app-deals-table',
  standalone: true,
  imports: [],
  templateUrl: './deals-table.component.html',
  styleUrl: './deals-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsTableComponent {}
```

## Dependency Injection

Use the inject() function instead of constructor injection.

```ts
private readonly dealsStore = inject(DealsStore);
```

Dependencies should normally be declared as private readonly unless the template needs direct access.

## Template Control Flow

Use Angular 17 built-in control flow:

- @if
- @else
- @for
- @switch
- @empty

Do not introduce:

- *ngIf
- *ngFor
- *ngSwitch

Always provide a stable tracking expression:

```html
@for (deal of deals(); track deal.id) {
<app-deal-row [deal]="deal" />
}
```

Do not track objects by array index when a stable identifier exists.

## Signals

Use Signals for synchronous application and component state.

Preferred APIs:

- signal()
- computed()
- effect() only for genuine side effects
- asReadonly() when exposing writable state

Use computed() for derived state rather than storing duplicate values.

```ts
private readonly dealsState = signal<readonly Deal[]>([]);
readonly deals = this.dealsState.asReadonly();
readonly filteredDeals = computed(() => {
  const term = this.searchTerm().trim().toLowerCase();
  return this.deals().filter((deal) => deal.name.toLowerCase().includes(term));
});
```

Do not use BehaviorSubject for ordinary synchronous state.

RxJS remains appropriate for asynchronous streams such as:

- HTTP requests
- debounced input
- WebSocket events
- complex event composition

## Effects

Avoid using effect() to propagate state from one signal into another.

Prefer:

- computed() for derived values
- event handlers for explicit state changes
- pure functions for calculations

Every effect must have an identifiable external side effect, such as:

- writing to browser storage
- sending analytics
- synchronizing with a non-Angular API

## Forms

Use typed reactive forms.

Do not use untyped forms.

```ts
readonly form = this.formBuilder.nonNullable.group({
  name: ['', [Validators.required]],
  address: ['', [Validators.required]],
  purchasePrice: [0, [Validators.required, Validators.min(0.01)]],
  netOperatingIncome: [0, [Validators.required, Validators.min(0)]],
});
```

Keep financial calculations in pure functions instead of embedding them directly in templates.

## Routing

Use standalone route configuration in app.routes.ts.

Use functional guards:

```ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
```

Frontend authentication is only a simulation for this challenge and must not be described as a real security boundary.

## Inputs and Outputs

Prefer strongly typed component contracts.

Do not mutate input values.

For Angular 17 compatibility, conventional @Input() and @Output() APIs are acceptable.

Do not introduce APIs from later Angular versions unless the installed Angular 17 minor explicitly supports them.

## Subscriptions

Avoid manual subscriptions where the template async pipe or signal interop can express the same behavior.

When a subscription is necessary, use Angular lifecycle-aware teardown such as takeUntilDestroyed().

Never create an unmanaged subscription.

## Browser APIs

This is a client-side SPA.

Browser APIs may be used when necessary, but access should remain isolated behind services when practical.

Do not introduce SSR-specific abstractions because SSR is intentionally outside the challenge scope.

## TypeScript and Code Style

TypeScript strict mode is enabled and should stay enabled.

- Do not use any. Prefer unknown and narrow the type.
- Type public boundaries explicitly, and let inference handle local variables.
- Mark fields and arrays readonly when they are never reassigned.
- Keep business rules in pure functions rather than inside components.
- Prefix a deliberately unused parameter with an underscore. Delete unused
  variables, and write catch {} rather than binding an error you never read.
- Component selectors are app- prefixed kebab-case; directive selectors are app
  prefixed camelCase. ESLint enforces both.
- Co-locate each spec with the file it tests as <name>.spec.ts.

Prettier owns formatting. Do not hand-format code to work around it, and do not
add formatting rules to ESLint.

## Completion Checklist

Before considering Angular work complete:

- confirm standalone architecture
- confirm OnPush
- confirm strict typing
- confirm no any
- confirm no unmanaged subscriptions
- confirm Angular 17 control flow
- confirm stable @for tracking
- confirm tests were added or updated
- confirm production build passes
