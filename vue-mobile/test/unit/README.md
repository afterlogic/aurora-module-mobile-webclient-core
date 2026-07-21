# Mobile unit / component tests (Vitest)

Fast tests without a browser and without a running Aurora instance. They complement Playwright E2E (`e2e/`), they do not replace it.

## Why

| | Unit / component (Vitest) | E2E (Playwright) |
|--|--|--|
| What it covers | Utilities, pure logic, isolated Vue components | Real browser flows against a live backend |
| Speed | Seconds | Minutes |
| Needs server / build | No | Yes (MAMP + `yarn build-production`) |
| Where to run | Locally + CI on every PR | Locally / dedicated environment (not in lightweight PR CI) |

The goal at this stage is the **pipeline**: write tests → run locally → run automatically in CI. Not maximum coverage.

## When to write

- **Utilities** (`src/utils/*`) — whenever logic changes; cheapest and most stable tests.
- **Simple UI components** (`AppButton`, layout props/slots) — when props, disabled/loading, or conditional render matter.
- **Do not write unit tests** for heavy pages with API/Pinia/routing “like E2E” — use Playwright for that.
- New bug in a pure function → failing unit test first, then the fix.
- A new `data-test-id` for unit tests is usually unnecessary; for E2E it is.

## Layout

```text
test/unit/
  setup.js                 # Quasar plugin for @vue/test-utils
  utils/*.spec.js          # unit
  components/*.spec.js     # component
vitest.config.mjs
```

Names: `*.spec.js` next to the area (`utils/`, `components/`). Same aliases as in `jsconfig.json` (`src/`, `components/`, …).

## Running locally

Yarn classic **1.x**, Node **18 or 22** (same as E2E).

```bash
cd modules/CoreMobileWebclient/vue-mobile
yarn                          # once / after lockfile updates
yarn test:unit                # single run
yarn test:unit:watch          # watch while developing
yarn test:unit:ui             # Vitest UI in the browser
yarn test:unit:coverage       # coverage report (optional)
```

`yarn test` currently also runs the unit suite (fast default for CI/local checks).

Aurora server, `.env.e2e`, and `build-production` are **not** required.

## Where they should run

Each mobile module is a separate git repository. Tests live **in the same module** as the code.

1. **Locally in the module** — `yarn test:unit` / `test:unit:watch`.
2. **Pre-commit (module)** — with `core.hooksPath=.githooks/` the hook:
   - if `vue-mobile/test/unit` exists **and** the index has changes under `vue-mobile/` → `yarn test:unit`;
   - otherwise the unit step is skipped (PHP-only commits stay fast).
   Enable: `git config --local core.hooksPath .githooks/`  
   or for every module in an install: `./dev/batch.sh git config --local core.hooksPath .githooks/`  
   Patch Vitest into hooks across modules: `./dev/patch-module-precommit-unit.sh`.
3. **All modules in an install** — `./dev/run-mobile-unit-tests.sh` (CI/CD on a full tree with `modules/`).
4. **GitHub Actions (sub-repo)** — `CoreMobileWebclient/.github/workflows/unit.yml` (`vue-mobile/**` → `yarn test:unit`).
5. **External / staging server** — not needed for Vitest (only for E2E).

## Starter specs

| File | Type |
|------|------|
| `utils/validation.spec.js` | unit |
| `utils/text.spec.js` | unit |
| `utils/common.spec.js` | unit |
| `utils/types.spec.js` | unit |
| `utils/address.spec.js` | unit |
| `components/AppButton.spec.js` | component |
| `components/MenuButton.spec.js` | component |
| `components/LoginLayout.spec.js` | component (+ mock `settings`) |

## Component tests: notes

- `setup.js` loads Quasar and registers components explicitly (`QBtn`, etc.) — CLI auto-import does not work in Vitest; add new Quasar tags to `components` there.
- Mock heavy dependencies with `vi.mock` (see `LoginLayout.spec.js`).
- Router — `createMemoryHistory` + `vue-router` (see `MenuButton.spec.js`).
- SVGs are stubbed in `vitest.config.mjs`.

## Difference from E2E

- Unit tests do **not** catch Turnstile, real login, IMAP/files.
- Unit tests do **not** replace scenarios in `e2e/README.md`.
- A failing product bug in E2E is not “fixed” by weakening unit assertions — see the E2E rules in the repository.

## Later (out of scope for this stage)

- More tests for utils and isolated components.
- Optional: coverage thresholds, `test:unit` in the shared PR gate.
- Keep E2E on a separate job/environment with secrets and a running Aurora.
