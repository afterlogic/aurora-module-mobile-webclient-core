# Mobile E2E (Playwright)

Automated tests for the **mobile** Quasar/Vue UI (`?mobile-version`). Selectors use `data-test-id`.

This package (`CoreMobileWebclient/vue-mobile`) is the **runner** (config, shared helpers, `.env.e2e`,
SPA build). **`@playwright/test` lives in the Aurora install-root** `package.json` / `node_modules`.

---

## Layout

```text
<install-root>/package.json                  ← @playwright/test + npm run test:e2e-mobile*
modules/CoreMobileWebclient/vue-mobile/      ← Quasar app + Playwright runner (cwd for config)
modules/CoreMobileWebclient/vue-mobile/.env.e2e
modules/CoreMobileWebclient/vue-mobile/test/e2e/helpers/   # login, ready, paths
modules/CoreMobileWebclient/vue-mobile/test/e2e/fixtures/
modules/CoreMobileWebclient/vue-mobile/test/e2e/scripts/
modules/<MobileWebclient>/vue-mobile/test/e2e/*.spec.js
modules/<MobileWebclient>/vue-mobile/test/e2e/helpers/     # domain helpers
```

| Piece | Responsibility |
|-------|----------------|
| Install-root `package.json` | `@playwright/test` and `npm run test:e2e-mobile*` |
| This package’s scripts | Thin wrappers → install-root Playwright binary |
| `playwright.config.js` | Spec discovery, devices, baseURL, workers, retries |
| `test/e2e/helpers/` | Shared login / ready / paths (`AURORA_MOBILE_E2E_ROOT`) |
| `modules/*/vue-mobile/test/e2e/*.spec.js` | Per-module scenarios |

`playwright.config.js` discovers every `modules/<Name>/vue-mobile/test/e2e` with `*.spec.js` and
builds projects `ModuleName-<device>` (**single-token names, no spaces**).

This package’s `test/e2e` has **no** top-level `*.spec.js` (shared runner assets only).

---

## Preconditions

1. Mobile UI opens in a browser: `http://localhost:8888/?mobile-version` or on another domain.
2. Install-root deps: `npm install` (provides Playwright).
3. **Node 18 or 22** (not Node 24) and **npm**.
4. After changing Vue / `data-test-id`, run `npm run build-production` so `static/vue-mobile/` updates.

---

## Setup (first time)

### 1. Install Playwright at the Aurora install root

```bash
# from install root
npm install
```

### 2. Download Playwright browsers

```bash
# from install root
npm run test:e2e-mobile:install-browsers

# from this directory
npm run test:e2e:install-browsers

# Linux only, from install root — installs the OS-level libraries the browsers need (requires sudo)
sudo npx playwright install-deps chromium firefox webkit
```

### 3. Create `.env.e2e`

```bash
# cwd = modules/CoreMobileWebclient/vue-mobile
cp .env.e2e.example .env.e2e
# edit E2E_LOGIN and E2E_PASSWORD
```

`.env.e2e` is **gitignored** — do not commit it. Playwright loads it automatically.
Don't forget to protect `.env.e2e` from web access.

---

## Environment variables (`.env.e2e`)

| Variable | Required | Meaning |
|----------|----------|---------|
| `PLAYWRIGHT_BASE_URL` | yes* | Mobile UI URL. *Default: `http://localhost:8888/?mobile-version` |
| `E2E_LOGIN` | yes | Test user |
| `E2E_PASSWORD` | yes | Test password |
| `E2E_COMPOSE_TO` | no | Compose recipient (default = `E2E_LOGIN`) |
| `E2E_LOGIN_SECONDARY` | no | Second test user for multi-user flows (share/leave-share, …). Must be a team contact of `E2E_LOGIN` on the stand |
| `E2E_PASSWORD_SECONDARY` | no | Password for `E2E_LOGIN_SECONDARY` |

Optional `MAIL_*` / `E2E_MAIL_*`: email-report wrapper (`npm run test:e2e:email` here).
`WEB_INSTALL_URL` is an optional variable that represents this installation's URL and is used to compose the test results link.

To check the mail setup, run `send-e2e-report.php` with no parameters — this sends a plain test email to confirm the mail delivery channel is working.

```bash
# cwd = modules/CoreMobileWebclient/vue-mobile
php ./test/e2e/scripts/send-e2e-report.php
```

### Custom / subdirectory URL

A one-off way to run the suite against an external/staging installation without touching `.env.e2e`:
setting `PLAYWRIGHT_BASE_URL` inline before the command overrides it for that single run only
(it takes precedence over `.env.e2e`, and nothing is changed on disk).

```bash
PLAYWRIGHT_BASE_URL=https://example.com/aurora/?mobile-version npm run test:e2e
```

Keep a trailing slash **before** `?` on subdirectory installs.

---

## Run

```bash
npm run test:e2e           # full device × module matrix
npm run test:e2e:ui        # UI Mode
npm run test:e2e:report    # Runs a web server to show the test results
npm run test:e2e:email     # Playwright + email-report stub after run
npm run test:e2e:iphone    # all modules · iPhone13 Chromium
npm run test:e2e:webkit    # all modules · iPhoneSEWebKit + iPhone13WebKit
npm run test:e2e:firefox   # all modules · Pixel7Firefox
```

Extra args after the npm script name need `--`:

```bash
npm run test:e2e -- --setup "MailMobileWebclient iPhone13"
npm run test:e2e:ui -- --setup "MailMobileWebclient iPhone13" mail-mutations.spec.js
```

### UI Mode (`npm run test:e2e:ui`)

Opens Playwright’s interactive runner (pick tests, watch steps / DOM / network).

Prefer a narrow `--setup` so the list is not the full matrix:

```bash
npm run test:e2e:ui -- --setup "StandardLoginFormMobileWebclient iPhone13"
npm run test:e2e:ui -- --setup "MailMobileWebclient iPhone13" compose.spec.js
npm run test:e2e:ui -- --setup "* iPhone13"
```

If a run fails immediately with “Executable doesn't exist” / “Please run … playwright install”,
install browsers for **this** `@playwright/test` from the **install root**:

```bash
npm run test:e2e-mobile:install-browsers
```

Do **not** rely on a bare `npx playwright install` from another directory.

### One module / one device / one file

Use **`--setup "<modules> <devices>"`** (the runner expands it to
Playwright `--project=Module-Device`).

- First token: module name(s), comma-separated — or `*` for every module with specs.
- Rest: device name(s), comma-separated (`iPhone13`, `Pixel7`, `Pixel7Firefox`, …).
- Aliases: `"iPhone 13"` → `iPhone13`, `firefox` → `Pixel7Firefox`, …
- Shorthands: `--setup "*iPhone13"` / `--setup "MailMobileWebclient-iPhone13"` also work.
- Anything after `--setup "…"` goes to Playwright (file name, `--grep`, `--list`, …).

```bash
npm run test:e2e -- --setup "MailMobileWebclient iPhone13"
npm run test:e2e -- --setup "* iPhone13"
npm run test:e2e -- --setup "MailMobileWebclient,ContactsMobileWebclient iPhone13,Pixel7"
npm run test:e2e -- --setup "MailMobileWebclient iPhone13" mail-mutations.spec.js
npm run test:e2e -- --setup "* iPhone13" --list
```

Without `--setup`, the full matrix runs.

In the console: steps like `→ Open mobile login page`.  
HTML report: timeline, screenshots on failure, **Trace** replay.

Flaky mitigation (config/helpers):

- 1 automatic retry
- clean session before login
- wait for Turnstile token
- wait for footer `nav-mail` after login
- shared list-ready waits
- compose recipient: `.first()` option + wait for dialog close

---

## Device matrix

| Project suffix | Engine | Playwright device preset | Viewport |
|----------------|--------|--------------------------|----------|
| `iPhoneSE` | Chromium | `iPhone SE` | 320×568 |
| `iPhone13` | Chromium | `iPhone 13` | 390×664 (baseline) |
| `Pixel7` | Chromium | `Pixel 7` | 412×839 |
| `Pixel7Firefox` | Firefox (Gecko) | `Pixel 7` | 412×839 |
| `iPhoneSEWebKit` | WebKit | `iPhone SE` | 320×568 |
| `iPhone13WebKit` | WebKit | `iPhone 13` | 390×664 |

---

## Workers

- Default **`workers: 1`**
- `fullyParallel: false`
- `retries: 1`

---

## Adding a module suite

1. Create `modules/YourMobileWebclient/vue-mobile/test/e2e/` with `*.spec.js`.
2. Import shared helpers:

```js
const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(
  path.join(process.env.AURORA_MOBILE_E2E_ROOT, 'test/e2e/helpers/paths')
)
const { loginAsTestUser } = sharedHelper('login')
```

3. Re-run — discovery picks it up (no config edit).

---

## Report

```bash
npm run test:e2e:report
```

Report directory: `modules/CoreMobileWebclient/vue-mobile/playwright-report/`.

---
