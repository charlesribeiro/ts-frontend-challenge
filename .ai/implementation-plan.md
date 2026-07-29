# Implementation Plan

## Delivery Principle

Build the smallest complete, polished application that satisfies the challenge requirements.

The project is time-boxed, so prioritize:

1. correctness
2. clear architecture
3. usability
4. meaningful tests
5. visual polish
6. documentation

Do not prioritize speculative infrastructure or production-scale abstractions unless they directly support a requirement.

---

# Phase 1 — Project Foundation

## Goals

Establish a reliable Angular 17 project baseline.

## Tasks

- confirm Angular 17 is installed
- confirm strict mode is enabled
- confirm the project uses standalone components
- configure routing
- configure SCSS
- add linting
- add formatting
- add Jest
- add GitHub Actions
- add Husky and lint-staged
- add CodeRabbit configuration
- add `.nvmrc`
- create the initial feature-first folder structure
- add the essential `.ai` documentation files
- verify the generated application runs locally

## Suggested Structure

```text
src/app/
├── core/
├── features/
├── shared/
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

## Definition of Done

The following commands pass:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:ci
npm run build:prod
```

The application should also start successfully with:

```bash
npm start
```

---

# Phase 2 — Domain Model and State

## Goals

Implement the deal domain and its core business rules before building the full interface.

## Tasks

- create the `Deal` model
- add realistic mock deal data
- implement the capitalization-rate pure function
- define search-filter state
- define price-filter state
- create the signal-based deals store
- expose read-only signals
- add immutable deal creation
- derive filtered deals with `computed()`
- write focused unit tests

## Required Behaviors

- deal data has one source of truth
- cap rate is calculated from NOI and purchase price
- search is case-insensitive
- search trims surrounding whitespace
- price filtering supports greater-than and less-than
- exact price boundaries are excluded
- search and price filters work together
- invalid filters do not break the interface
- adding a deal updates derived state automatically

## Definition of Done

- business logic is framework-independent where practical
- writable signals remain private
- no state-management library is introduced
- domain tests pass
- no derived state is stored redundantly

---

# Phase 3 — Authentication and Application Shell

## Goals

Implement the required simulated authentication flow and protected navigation.

## Tasks

- create an authentication service or store
- define the accepted test credentials
- create the login page
- build a typed reactive login form
- show invalid-credentials feedback
- create a functional authentication guard
- protect the deals route
- redirect unauthenticated users to `/login`
- create the application shell
- add navigation
- add logout behavior
- redirect authenticated users appropriately

## Required Behaviors

- valid credentials authenticate the user
- invalid credentials do not authenticate the user
- unauthenticated users cannot access protected routes through normal navigation
- logout clears authentication state
- refreshing the application may reset authentication because persistence is intentionally out of scope

## Definition of Done

- route guard behavior is tested
- authentication state behavior is tested
- the interface clearly communicates that login errors occurred
- simulated authentication is not described as real security

---

# Phase 4 — Deals Dashboard

## Goals

Create the primary dashboard for browsing and filtering deals.

## Tasks

- create the deals page
- create the search control
- create the price comparison control
- create the price amount control
- create the deals table
- display the deal name
- display the address
- display the purchase price
- display the NOI
- display the calculated cap rate
- add safe search-term highlighting
- add a clear-filters action
- add a no-results state
- ensure the table remains usable on narrow screens

## Required Behaviors

- filtering updates reactively
- currency formatting is consistent
- capitalization rate displays as a percentage
- matching name segments are highlighted
- highlighting preserves Angular escaping
- no matching results produce a useful empty state
- numeric columns are easy to scan
- all controls are keyboard accessible

## Definition of Done

- no `bypassSecurityTrustHtml()` is used
- table markup is semantic
- filter behavior is tested
- highlighting edge cases are tested
- desktop and mobile layouts are usable

---

# Phase 5 — Deal Creation

## Goals

Allow users to create a valid deal and add it to the current in-memory collection.

## Tasks

- create a typed reactive form
- add the deal name field
- add the address field
- add the purchase price field
- add the NOI field
- display the derived cap rate
- add validation messages
- prevent invalid submission
- normalize text before storage
- generate a unique identifier
- add the deal immutably
- reset or close the form after successful submission
- update the dashboard automatically

## Required Behaviors

- name is required
- address is required
- whitespace-only text is rejected or normalized
- purchase price must be greater than zero
- NOI cannot be negative
- cap rate updates when financial fields change
- invalid data is never added
- valid data appears immediately in the deals list

## Definition of Done

- form validation is tested
- financial calculation is tested
- submission behavior is tested
- no duplicated cap-rate state is introduced
- newly created deals work with existing filters

---

# Phase 6 — Quality and Accessibility Review

## Goals

Review the implementation as a complete user experience rather than as isolated features.

## Tasks

- test keyboard-only navigation
- review focus visibility
- verify labels and form controls are associated
- verify heading hierarchy
- review contrast
- verify error messages are understandable
- verify empty states
- verify responsive behavior
- inspect the browser console
- review loading behavior, if any exists
- remove dead code
- remove unnecessary abstractions
- remove unused dependencies
- review CodeRabbit feedback manually

## Definition of Done

- no known accessibility blockers remain
- no console errors remain
- no obvious layout breakage remains
- all accepted automated-review suggestions are understood
- rejected automated-review suggestions have a clear reason

---

# Phase 7 — Submission Polish

## Goals

Prepare a repository that is easy for an evaluator to run, review, and discuss.

## Tasks

- complete the README
- document setup commands
- document test credentials
- document architecture decisions
- document intentional limitations
- document production improvements
- add screenshots
- add a deployed application link, when available
- verify the repository is public
- verify CI passes on `main`
- review commit and PR history
- remove temporary files
- confirm the application works from a fresh install
- run a production build
- rehearse the main design decisions

## README Topics

The README should explain:

- what the application does
- how to install dependencies
- how to run it
- how to run tests
- which credentials to use
- why Signals were chosen
- why no state library was used
- why SSR was not enabled
- why authentication is simulated
- what would change in production
- which AI-assisted tools were used
- how AI-generated suggestions were reviewed

## Final Verification

Run:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test:ci
npm run build:prod
```

Then manually verify:

- login
- protected routing
- logout
- deal search
- greater-than filtering
- less-than filtering
- combined filtering
- deal creation
- cap-rate calculation
- invalid-form behavior
- no-results behavior
- mobile layout

---

# Explicitly Out of Scope

Unless all required work is complete and substantial time remains, do not add:

- backend API
- database persistence
- real authentication
- SSR
- SSG
- NgRx
- NGXS
- Akita
- complex animation
- editable deals
- deletable deals
- pagination
- internationalization
- a full design-system library
- speculative microfrontend architecture
- unnecessary repository abstractions
- multiple state stores for the same domain
- an end-to-end testing framework

These features may be discussed as production improvements without being implemented.

---

# Pull Request Plan

## PR 1 — Project Foundation

Include:

- Angular 17 baseline
- linting and formatting
- Jest
- CI
- Git hooks
- CodeRabbit
- project documentation
- initial folder structure

Suggested title:

```text
chore: establish project foundation
```

## PR 2 — Deal Domain and State

Include:

- deal model
- mock data
- cap-rate calculation
- Signals store
- filtering logic
- unit tests

Suggested title:

```text
feat: implement deal domain and signal-based state
```

## PR 3 — Authentication and Shell

Include:

- login page
- authentication state
- route guard
- protected layout
- logout

Suggested title:

```text
feat: add authentication flow and application shell
```

## PR 4 — Deals Dashboard

Include:

- filters
- deals table
- formatting
- highlighting
- empty state
- responsive behavior

Suggested title:

```text
feat: build deals dashboard and filtering
```

## PR 5 — Deal Creation

Include:

- typed form
- validation
- live cap rate
- deal submission
- tests

Suggested title:

```text
feat: add deal creation workflow
```

## PR 6 — Final Polish

Include:

- accessibility improvements
- documentation
- screenshots
- deployment configuration
- cleanup
- final tests

Suggested title:

```text
chore: finalize submission and documentation
```

---

# Decision Rule

Before adding a new abstraction, dependency, or feature, ask:

- Does it satisfy a current challenge requirement?
- Does it improve clarity or reliability?
- Does it reduce meaningful duplication?
- Can it be completed and tested within the available time?
- Can the decision be defended in the interview?

A simple, complete, well-tested implementation is preferable to an ambitious but unfinished one.
