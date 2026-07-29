# Architecture

## Layout

```text
src/
  app/
    app.component.*     Root component
    app.config.ts       Application providers
    app.routes.ts       Route definitions
  assets/               Static files copied into the build
  styles.scss           Global styles
  main.ts               Bootstrap
```

As the app grows, group by feature rather than by file type:

```text
src/app/
  core/                 App-wide singletons: HTTP, config, interceptors
  shared/               Reusable presentational components, pipes, directives
  features/<feature>/   One folder per feature, routed lazily
```

## Layering

Three layers, with dependencies pointing in one direction only:

1. **Components** render state and forward user intent. No HTTP, no business
   rules, no cross-feature imports.
2. **Services** own data access, caching and business rules. Injectable and
   unit-testable without the DOM.
3. **Models** are types and interfaces shared by both, with no behaviour.

A feature may depend on `core` and `shared`. `shared` must not depend on any
feature. Two features must not import from each other; lift the shared piece up
instead.

## State

Prefer signals for component-local state and derived values. Reach for RxJS at
the boundaries, where things are genuinely asynchronous or event-based, and
convert into signals for the template. Avoid adding a state management library
until there is a concrete problem it solves.

## Routing

Routes live in `app.routes.ts`. Lazy-load feature routes with `loadChildren` so
the initial bundle stays small; the production build enforces a 500 kB warning
budget.

## Where new code belongs

| Adding                            | Put it in                        |
| --------------------------------- | -------------------------------- |
| A screen or page                  | `features/<feature>/`            |
| A reusable button, card, or pipe  | `shared/`                        |
| An HTTP client or interceptor     | `core/`                          |
| A type used by more than one file | a `*.model.ts` next to its owner |
