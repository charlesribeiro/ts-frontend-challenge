# Agent guide

Conventions for AI coding agents working in this repository. Humans should read
[README.md](README.md) first; everything here applies to both.

## Stack

Angular 17 with standalone components, TypeScript in strict mode, SCSS, Jest for
tests. There is no backend in this repository.

## Commands

Run these from the repository root. Node version is pinned in `.nvmrc`.

| Task             | Command                 |
| ---------------- | ----------------------- |
| Dev server       | `npm start`             |
| Production build | `npm run build`         |
| Tests            | `npm test`              |
| Tests (watch)    | `npm run test:watch`    |
| Coverage         | `npm run test:coverage` |
| Lint             | `npm run lint`          |
| Lint and fix     | `npm run lint:fix`      |
| Format           | `npm run format`        |
| Format check     | `npm run format:check`  |

Before handing work back, `npm run lint`, `npm test` and `npm run build` must all
pass. These are the same checks CI runs.

## Conventions

- Standalone components only. Do not add `NgModule`s.
- Keep components thin: HTTP calls, state and business rules belong in services.
- Prefer signals for component state and `OnPush` change detection.
- Use `inject()` rather than constructor parameter injection in new code.
- Unsubscribe from long-lived observables, via `takeUntilDestroyed()` where possible.
- Component selectors are `app-` prefixed kebab-case; directive selectors are
  `app` prefixed camelCase. ESLint enforces both.
- Co-locate each spec with the file it tests as `<name>.spec.ts`.

## Formatting and linting

Prettier owns formatting and ESLint owns correctness; they are wired so they do
not conflict. Do not hand-format code to fight Prettier, and do not add
formatting rules to ESLint. A Husky pre-commit hook runs lint-staged over staged
files, so committed code is already linted and formatted.

## Tests

Jest with `jest-preset-angular`, configured in `jest.config.js` and bootstrapped
by `setup-jest.ts`. Tests run in jsdom, so there is no browser and no Karma.
Test observable behaviour through the component's public API and rendered
output, not private fields.

## Working agreements

- Make focused commits with a single concern each, using Conventional Commit
  prefixes (`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `ci:`, `refactor:`).
- Do not commit secrets, `.env` files, or build output.
- Do not upgrade Angular or add dependencies without saying why in the PR.
- If you change tooling or conventions, update this file and `.ai/` in the same
  change.

## Deeper context

`.ai/` holds longer-form background that does not belong in this quick
reference. See [.ai/README.md](.ai/README.md).
