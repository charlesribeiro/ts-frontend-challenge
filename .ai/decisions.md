# Decisions

Append-only log of technical decisions. Newest last. Keep entries short: what
was decided, why, and what it costs. When a decision is reversed, add a new
entry that supersedes the old one instead of deleting it.

## 1. Jest instead of Karma and Jasmine

**Decision:** Run unit tests with Jest via `jest-preset-angular`. Karma, Jasmine
and the Angular `test` builder were removed.

**Why:** Karma launches a real Chrome instance, which is slow locally and needs a
browser installed in CI. Jest runs in jsdom, starts faster, and supports watch
mode and coverage out of the box.

**Cost:** Diverges from the Angular CLI default, so `ng test` no longer works and
`ng generate` produces specs written for Jasmine that occasionally need small
edits. Anything genuinely browser-dependent needs a separate real-browser test.

## 2. Prettier owns formatting, ESLint owns correctness

**Decision:** Prettier formats every file type. ESLint runs `angular-eslint` plus
`eslint-config-prettier`, which disables the ESLint rules that overlap with
Prettier.

**Why:** Two tools with opinions about formatting produce fights that show up as
noise in review. Splitting the responsibilities means each file has exactly one
formatter and review comments stay about behaviour.

**Cost:** Prettier's output is not configurable beyond a handful of options, so
occasional line breaks are not what a human would choose.

## 3. Standalone components, no NgModules

**Decision:** Use standalone components, directives and pipes throughout.
Providers are registered in `app.config.ts`.

**Why:** Standalone is the direction Angular is moving, and it removes a layer of
indirection: a component's dependencies are declared in the component itself.

**Cost:** Some older libraries and tutorials still assume `NgModule`s and need a
wrapper or an `importProvidersFrom` call.

## 4. Node version pinned in .nvmrc

**Decision:** Pin Node 22 in `.nvmrc`, declare `engines.node` in `package.json`,
and have CI read the version from `.nvmrc`.

**Why:** One file defines the runtime for local development and CI, so a build
that passes locally is running on the same major version as CI.

**Cost:** Bumping Node means editing two places, and `engines` is a warning
rather than a hard failure unless `engine-strict` is enabled.
