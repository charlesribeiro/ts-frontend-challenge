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

## 5. Node narrowed to 20 to match Angular 17.3's tested matrix

**Supersedes:** 4.

**Decision:** Pin Node 20 in `.nvmrc` and constrain `engines.node` to
`^18.13.0 || ^20.9.0`.

**Why:** `^18.13.0 || ^20.9.0` is exactly the range Angular 17.3 is tested
against. Node 22 happens to work, but the Angular packages' own `engines` field
(`>=20.9.0`) has no upper bound, so nothing warns when the runtime drifts past
what Angular has verified.

**Cost:** Gives up the current LTS until Angular is upgraded. It also turned out
to pin an end-of-life runtime, which is why entry 6 reverses it.

## 6. Node returned to 22 under a documented waiver

**Supersedes:** 5.

**Decision:** Pin Node 22 in `.nvmrc` and constrain `engines.node` to
`^22.12.0`.

**Why:** Node 18 reached end of life on 2025-04-30 and Node 20 on 2026-04-30, so
entry 5 pinned a runtime that no longer receives security patches. Angular 17.3
is tested only against those two lines and Angular 17 is itself out of support,
so that matrix will never be updated: no Node version can satisfy both "tested
by Angular 17" and "still patched". An unpatched runtime is the larger risk of
the two, so we take the supported Node and accept being outside Angular's tested
range. Node 22.22.0 was verified against format, lint, typecheck, tests and a
production build before making the change.

**Waiver:** Scoped to Node 22 only; Node 24 is left out because it has not been
verified against Angular 17. Expires on 2027-04-30, when Node 22 leaves
maintenance, or when Angular is upgraded, whichever comes first. Upgrading
Angular is the real fix and removes the need for the waiver.

**Cost:** Runs on a Node major Angular 17.3 never tested, so a runtime-specific
bug in the toolchain is our problem to diagnose rather than a known
incompatibility.
