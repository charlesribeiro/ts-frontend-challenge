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

## Demo



https://github.com/user-attachments/assets/499aaef9-e7c1-48d8-8d85-6345188e87a7



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
