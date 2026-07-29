# Application Architecture

## Objective

Build a small, polished Angular 17 application that demonstrates senior frontend engineering judgment without introducing unnecessary complexity.

The application manages commercial real estate deals and includes:

- simulated authentication
- protected navigation
- deal listing
- deal creation
- deal-name search
- purchase-price filtering
- automatic capitalization-rate calculation
- safe search-term highlighting

The challenge is time-boxed. Completeness, clarity, and explainability are more important than speculative scalability.

## Architectural Style

Use a feature-first structure.

```text
src/app/
├── core/
│   ├── auth/
│   └── layout/
├── features/
│   ├── auth/
│   └── deals/
│       ├── components/
│       ├── data-access/
│       ├── models/
│       ├── pages/
│       ├── pipes/
│       └── utils/
└── shared/
    ├── components/
    └── styles/
```

## Layer Responsibilities

### Core

The core area contains application-wide infrastructure that should have one logical instance.

Examples:

- authentication state
- route guards
- application shell
- global navigation
- application-level configuration

Core code must not contain deal-specific business rules.

### Features

The features area contains code owned by a specific business capability.

The deals feature owns:

- deal models
- mock deal data
- deal state
- filtering logic
- financial calculations
- deal components
- deal pages

Feature code should remain colocated unless it is genuinely reusable across unrelated features.

### Shared

The shared area contains reusable, domain-neutral presentation or styling primitives.

Examples:

- generic buttons
- reusable form controls
- loading indicators
- layout helpers
- shared design tokens

Do not move a component into shared merely because it is used more than once inside the same feature.

## Component Boundaries

### Page Components

Page components are responsible for orchestration.

They may:

- connect routes to application state
- coordinate child components
- handle page-level user flows
- read state from stores or services
- respond to navigation events

They should avoid:

- detailed presentation markup
- duplicated business calculations
- complex formatting logic
- direct DOM manipulation

### Presentational Components

Presentational components should remain focused.

They should:

- receive strongly typed inputs
- emit user intentions
- render a specific part of the interface
- avoid direct access to global state when possible
- remain reusable within their feature

Examples:

- DealsTableComponent
- DealFiltersComponent
- DealFormComponent
- DealCapRateComponent

## State Management

Use one signal-based store or service as the source of truth for deals.

The store should own:

- the master deal collection
- search criteria
- price-filter criteria
- computed filtered results
- immutable state updates

Do not introduce NgRx, NGXS, Akita, or another state-management library.

The challenge state is small and synchronous, so a dedicated state library would add more ceremony than value.

Expected state flow:

```text
User action
    ↓
Component event handler
    ↓
Store mutation method
    ↓
Writable signal update
    ↓
Computed state recalculation
    ↓
OnPush component rendering
```

Writable signals should remain private whenever possible.

Expose read-only signals to consumers.

Example:

```ts
@Injectable({
  providedIn: 'root',
})
export class DealsStore {
  private readonly dealsState = signal<readonly Deal[]>(INITIAL_DEALS);
  readonly deals = this.dealsState.asReadonly();
  readonly filteredDeals = computed(() => {
    return filterDeals(this.deals(), this.searchTerm(), this.priceFilter());
  });
  addDeal(deal: Deal): void {
    this.dealsState.update((deals) => [...deals, deal]);
  }
}
```

## Data Persistence

Deal and authentication data are intentionally held in memory.

Consequences:

- refreshing the browser resets the application
- no backend API is required
- no persistence guarantee should be implied
- client-side authentication is not a security boundary

This is an explicit scope decision, not an accidental omission.

Persistence should not be added unless the challenge requirements explicitly request it.

## Business Logic

Keep business rules independent from Angular where possible.

The capitalization-rate calculation should be implemented as a pure function:

```ts
export function calculateCapRate(netOperatingIncome: number, purchasePrice: number): number {
  if (purchasePrice <= 0 || netOperatingIncome < 0) {
    return 0;
  }
  return netOperatingIncome / purchasePrice;
}
```

Benefits:

- easy unit testing
- no Angular dependency
- reusable across forms and tables
- predictable behavior
- no duplicated financial logic

Filtering logic should also be implemented through pure functions where practical.

## Authentication

Authentication is simulated in the browser.

The implementation exists to demonstrate:

- login flow
- protected routes
- redirect behavior
- logout behavior
- Angular routing knowledge

It does not provide real security because all authentication state and credentials exist on the client.

In production, authentication would be handled by a backend or identity provider.

## Routing

Use standalone route configuration.

Recommended route structure:

```text
/login
/deals
```

The deals route should be protected by a functional route guard.

Unauthenticated users should be redirected to /login.

Authenticated users should be redirected away from the login page when appropriate.

Avoid deeply nested routes unless the interface requires them.

## Error Handling

Use local, explicit error handling appropriate to the challenge.

Expected error and empty states include:

- invalid credentials
- invalid form fields
- invalid financial values
- no deals matching the current filters
- attempted access to a protected route

Do not build a global error-handling framework without a real requirement.

Error messages should be:

- clear
- actionable
- close to the relevant control
- accessible to assistive technology when necessary

## Security

Avoid dynamic trusted HTML.

Search highlighting should be implemented by splitting text into matching and nonmatching segments and rendering them through normal Angular interpolation.

Do not use `bypassSecurityTrustHtml()` for search highlighting.

Angular’s default escaping should remain intact.

Do not store real secrets, API keys, or production credentials in the repository.

## Dependency Policy

Prefer Angular and browser platform APIs.

Add a third-party package only when:

1. it solves a meaningful problem
2. the implementation cost is lower than a small local solution
3. its maintenance and bundle costs are justified
4. the decision can be clearly explained

Avoid dependencies for:

- basic state management
- UUID generation
- simple formatting
- search highlighting
- trivial utility functions

## Testing Boundaries

Prioritize tests around behavior and business rules.

High-priority areas:

- capitalization-rate calculation
- deal filtering
- immutable deal creation
- authentication state
- route-guard behavior
- form validation
- search highlighting

Avoid tests that depend heavily on private implementation details.

## Accessibility

Accessibility is part of the architecture, not a final polishing step.

The implementation should include:

- semantic HTML
- visible form labels
- keyboard-accessible controls
- visible focus states
- accessible validation messages
- semantic tables
- sufficient color contrast
- no color-only status communication

## Responsive Design

The application should work at desktop, tablet, and mobile widths.

For narrow layouts:

- stack controls when necessary
- allow tables to scroll horizontally
- preserve readable text sizes
- keep primary actions accessible
- avoid hiding critical deal information

## Future Production Evolution

With a real backend and production requirements, the architecture could evolve to include:

- typed HTTP repositories
- server-side authentication
- persisted deal data
- loading and error state
- authorization rules
- API validation
- pagination
- server-side filtering
- observability
- audit logging
- environment-specific configuration
- end-to-end testing
- deployment pipelines

These are intentionally outside the take-home scope.

## Architectural Decision Rule

Before adding a new abstraction, library, or layer, ask:

- Does it solve a current requirement?
- Does it make the code easier to understand?
- Does it reduce meaningful duplication?
- Can the decision be explained clearly in an interview?
- Is the added complexity justified for this challenge?

A simple, complete architecture is preferable to an ambitious but partially implemented one.
