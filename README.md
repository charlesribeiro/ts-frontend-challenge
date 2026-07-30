# ts-frontend-challenge

An Angular 17 single-page application built with standalone components,
TypeScript in strict mode and SCSS.

## Requirements

- Node — version pinned in [`.nvmrc`](.nvmrc); run `nvm use` to match it
- npm 10 or newer

## Getting started

```bash
nvm use
npm ci
npm start
```

The dev server runs at http://localhost:4200 and reloads on file changes.

## MockAPI deals

Deals are loaded and created against a MockAPI `/deals` resource. The base URL
is configured in [`src/environments/environment.ts`](src/environments/environment.ts)
(and the production twin). An empty pipeline or a load error usually means the
resource is missing or unreachable — see
[`.ai/domain-model.md`](.ai/domain-model.md) for the expected wire shape.

## Demo

https://github.com/user-attachments/assets/499aaef9-e7c1-48d8-8d85-6345188e87a7

Demo login: `demo@example.com` / `demo1234` (also shown on the login page).

## Challenge coverage

### Required

| Requirement                                           | Status | Notes                                             |
| ----------------------------------------------------- | ------ | ------------------------------------------------- |
| Angular 17                                            | Done   | `@angular/*` ^17.3                                |
| Deal fields: name, purchase price, address, NOI       | Done   | `deal.model.ts`                                   |
| Cap rate = NOI / purchase price (derived, not stored) | Done   | `calculate-cap-rate.ts`                           |
| Deal listing with a table of deals                    | Done   | `/deals` + `app-deals-table`; data from MockAPI   |
| Add one or more deals                                 | Done   | `app-deal-form` → POST                            |
| Filter by deal name                                   | Done   | Search in `app-deal-filters`                      |
| Filter purchase price (greater / less than)           | Done   | Comparison + amount                               |
| Login required for private pages                      | Done   | `authGuard` on the shell; `/login` + `guestGuard` |

Persistence across refresh was optional; deals survive refresh via MockAPI.
Auth remains simulated in memory and does not survive refresh.

### Tips / plus

| Item                                               | Status  | Notes                                                               |
| -------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| Live cap rate from form inputs                     | Done    | Form preview + table `%` pipe                                       |
| Highlight search matches in the table              | Done    | `highlightSearch` pipe → `<mark>`                                   |
| Company colors / visual polish                     | Partial | Tokenized “Deal Desk” UI; blue accent, not a literal Intapp palette |
| Angular best practices                             | Done    | Standalone, OnPush, `inject()`, signal store, feature folders       |
| Simulated client-side auth                         | Done    | Hardcoded demo credentials                                          |
| MockAPI + Zod at the HTTP boundary                 | Plus    | Beyond the brief                                                    |
| Loading / create / error / retry UX                | Plus    |                                                                     |
| A11y, Prettier, ESLint, Husky, CI, Jest thresholds | Plus    |                                                                     |
| Demo video in README                               | Plus    |                                                                     |

## Scripts

| Command                 | What it does                               |
| ----------------------- | ------------------------------------------ |
| `npm start`             | Dev server with live reload                |
| `npm run build`         | Build into `dist/`                         |
| `npm run build:prod`    | Production build into `dist/`              |
| `npm run watch`         | Development build, rebuilt on change       |
| `npm run typecheck`     | Typecheck without emitting output          |
| `npm test`              | Run the Jest suite once                    |
| `npm run test:watch`    | Run Jest in watch mode                     |
| `npm run test:coverage` | Run Jest and write coverage to `coverage/` |
| `npm run test:ci`       | Run Jest as CI does, with thresholds       |
| `npm run lint`          | Lint TypeScript and templates              |
| `npm run lint:fix`      | Lint and apply fixable corrections         |
| `npm run format`        | Format every file with Prettier            |
| `npm run format:check`  | Fail if anything is unformatted            |

## Project structure

```text
src/
  app/          Components, services and routes
  assets/       Static files copied into the build
  styles.scss   Global styles
  main.ts       Bootstrap
```

See [.ai/architecture.md](.ai/architecture.md) for the layering rules and where
new code belongs.

## Testing

Tests run on Jest with `jest-preset-angular` in a jsdom environment, so no
browser is required. Specs sit next to the code they cover as `<name>.spec.ts`.
Configuration lives in [`jest.config.js`](jest.config.js).

Current test coverage (`npm run test:coverage`): statements **98.57%**,
branches **91.3%**, functions **98.79%**, lines **98.45%** (146 tests passing).

<img width="1263" height="704" alt="Jest coverage summary: 98.57% statements, 91.3% branches, 98.79% functions, 98.45% lines across the app source" src="https://github.com/user-attachments/assets/a6c7f762-9d66-4e3e-93c8-4fd7e096932f" />

## Code quality

- **Prettier** formats every file type; configuration in `.prettierrc.json`.
- **ESLint** with `angular-eslint` covers TypeScript and template accessibility.
- **Husky** runs lint-staged before each commit, so staged files are linted and
  formatted automatically.
- **CI** runs format check, lint, typecheck, tests with coverage thresholds, and
  a production build on every pull request.

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org)
(`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `ci:`, `refactor:`). Keep each
commit to a single concern. Pull requests use the template in
[`.github/pull_request_template.md`](.github/pull_request_template.md).

## Working with AI agents

[AGENTS.md](AGENTS.md) is the entry point for coding agents and links to the
deeper context in [`.ai/`](.ai/README.md). Keep both current when conventions
change.
