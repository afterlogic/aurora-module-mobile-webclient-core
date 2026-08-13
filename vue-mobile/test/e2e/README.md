# Mobile E2E (Playwright)

Automated tests for the **mobile** Quasar/Vue UI (`?mobile-version`). Selectors use `data-test-id`.

This package (`CoreMobileWebclient/vue-mobile`) is the **runner** (config, shared helpers, `.env.e2e`,
SPA build). **`@playwright/test` lives in the Aurora install-root** `package.json` / `node_modules`.

Install-root entry (same run/UI/filter stories, short paths for `npm run test:e2e-mobile*`):
[`README-e2e-mobile.md`](../../../../../README-e2e-mobile.md) at the Aurora install root.

Unit / component tests (Vitest, no server): see [`../unit/README.md`](../unit/README.md).

Desktop E2E: [`README-e2e-desktop.md`](../../../../../README-e2e-desktop.md) /
[`modules/CoreWebclient/test/e2e/README.md`](../../../../CoreWebclient/test/e2e/README.md).

---

# Quick up and running

From the **Aurora install root**:

```bash
npm install
cp modules/CoreMobileWebclient/vue-mobile/.env.e2e.example \
   modules/CoreMobileWebclient/vue-mobile/.env.e2e
# fill E2E_LOGIN / E2E_PASSWORD
nvm use 22
npm run test:e2e-mobile:install-browsers
cd modules/CoreMobileWebclient/vue-mobile && npm run build-production && cd -
# Aurora must answer http://localhost:8888/?mobile-version
npm run test:e2e-mobile:ui
```

Or from this directory (`modules/CoreMobileWebclient/vue-mobile`):

```bash
npm run test:e2e:install-browsers
npm run build-production
npm run test:e2e:ui -- --setup "StandardLoginFormMobileWebclient iPhone13"
```

---

## Layout

```text
<install-root>/package.json                  ← @playwright/test + npm run test:e2e-mobile*
<install-root>/README-e2e-mobile.md          ← install-root docs (this suite)
modules/CoreMobileWebclient/vue-mobile/      ← Quasar app + Playwright runner (cwd for config)
modules/CoreMobileWebclient/vue-mobile/.env.e2e
modules/CoreMobileWebclient/vue-mobile/test/e2e/helpers/   # login, ready, paths
modules/CoreMobileWebclient/vue-mobile/test/e2e/fixtures/
modules/CoreMobileWebclient/vue-mobile/test/e2e/scripts/
modules/<MobileWebclient>/vue-mobile/test/e2e/*.spec.js
modules/<MobileWebclient>/vue-mobile/test/e2e/helpers/     # domain helpers
dev/run-mobile-e2e-tests.sh
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

1. Local Aurora is running (MAMP or equivalent).
2. Document Root points at the Aurora install root.
3. Mobile UI opens in a browser: `http://localhost:8888/?mobile-version`.
4. Install-root deps: `npm install` (provides Playwright).
5. **Node 18 or 22** (not Node 24) and **npm**.
6. After changing Vue / `data-test-id`, run `npm run build-production` so `static/vue-mobile/` updates.

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

# or from this directory
npm run test:e2e:install-browsers
```

### 3. Create `.env.e2e`

```bash
# cwd = modules/CoreMobileWebclient/vue-mobile
cp .env.e2e.example .env.e2e
# edit E2E_LOGIN and E2E_PASSWORD
```

`.env.e2e` is **gitignored** — do not commit it. Playwright loads it automatically.

---

## Environment variables (`.env.e2e`)

| Variable | Required | Meaning |
|----------|----------|---------|
| `PLAYWRIGHT_BASE_URL` | yes* | Mobile UI URL. *Default: `http://localhost:8888/?mobile-version` |
| `E2E_LOGIN` | yes | Test user |
| `E2E_PASSWORD` | yes | Test password |
| `E2E_COMPOSE_TO` | no | Compose recipient (default = `E2E_LOGIN`) |
| `SKIP_NPM_INSTALL` | no | For `dev/run-mobile-e2e-tests.sh`: skip `npm ci` |

Optional `MAIL_*` / `E2E_MAIL_*` / `WEB_INSTALL_URL`: email-report wrapper (`npm run test:e2e` here).

### Custom / subdirectory URL

```bash
PLAYWRIGHT_BASE_URL=https://example.com/aurora/?mobile-version npm run test:e2e
```

Keep a trailing slash **before** `?` on subdirectory installs.

If MAMP is not running, the suite fails with a connection error — start the server and retry.

---

## Run

### From the install root (preferred)

```bash
npm run test:e2e-mobile
npm run test:e2e-mobile:ui
npm run test:e2e-mobile:report
npm run test:e2e-mobile:install-browsers

./dev/run-mobile-e2e-tests.sh
./dev/run-mobile-e2e-tests.sh -- --setup "* iPhone13"
./dev/run-mobile-e2e-tests.sh -- --ui --setup "MailMobileWebclient iPhone13"
```

### From this directory (`vue-mobile`)

```bash
npm run test:e2e           # full device × module matrix
npm run test:e2e:iphone    # all modules · iPhone13 Chromium
npm run test:e2e:webkit    # iPhoneSEWebKit + iPhone13WebKit
npm run test:e2e:firefox   # Pixel7Firefox
npm run test:e2e:ui              # UI Mode
npm run test:e2e:report
npm run test:e2e                 # Playwright + email-report stub after run
```

Extra args after the npm script name need `--`:

```bash
npm run test:e2e -- --setup "MailMobileWebclient iPhone13"
npm run test:e2e:ui -- --setup "MailMobileWebclient iPhone13" mail-mutations.spec.js
```

### UI Mode (`npm run test:e2e:ui` / `npm run test:e2e-mobile:ui`)

Opens Playwright’s interactive runner (pick tests, watch steps / DOM / network).
**It does not start tests by itself** — select a test (or use filters) and click ▶.

Prefer a narrow `--setup` so the list is not the full matrix:

```bash
# install root
npm run test:e2e-mobile:ui -- --setup "StandardLoginFormMobileWebclient iPhone13"
npm run test:e2e-mobile:ui -- --setup "MailMobileWebclient iPhone13" compose.spec.js

# this directory
npm run test:e2e:ui -- --setup "* iPhone13"
```

If a run fails immediately with “Executable doesn't exist” / “Please run … playwright install”,
install browsers for **this** `@playwright/test` from the **install root**:

```bash
npm run test:e2e-mobile:install-browsers
```

Do **not** rely on a bare `npx playwright install` from another directory.

### One module / one device / one file

Use **`--setup "<modules> <devices>"`** (same idea as desktop; the runner expands it to
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
# install root
npm run test:e2e-mobile:report

# this directory
npm run test:e2e:report
```

Report directory: `modules/CoreMobileWebclient/vue-mobile/playwright-report/`.

---

## Staging / remote stand

1. Deploy `static/vue-mobile/` and `data-test-id` hooks.
2. Fill `.env.e2e` with staging `PLAYWRIGHT_BASE_URL` + credentials.
3. From install root: `npm run test:e2e-mobile:install-browsers` then `npm run test:e2e-mobile` / `:ui`.

---

## Command cheat sheet

| Where | Command | What it does |
|-------|---------|--------------|
| Install root | `npm run test:e2e-mobile` | Full matrix |
| Install root | `npm run test:e2e-mobile:ui` | **UI Mode** |
| Install root | `npm run test:e2e-mobile:iphone` | All modules · iPhone13 |
| Install root | `npm run test:e2e-mobile:report` | HTML report |
| Install root | `npm run test:e2e-mobile:install-browsers` | Browsers |
| Install root | `./dev/run-mobile-e2e-tests.sh [-- --setup "…"]` | Scan + run |
| This directory | `npm run test:e2e` / `:iphone` / `:webkit` / `:firefox` | Headless |
| This directory | `npm run test:e2e:ui` | **UI Mode** |
| This directory | `npm run build-production` | Refresh `static/vue-mobile/` |

---

## Desktop vs mobile `--setup`

| | Desktop | Mobile |
|-|---------|--------|
| Scripts | `npm run test:e2e-desktop*` | `npm run test:e2e-mobile*` |
| Flag | `--setup "Module Chrome"` | `--setup "Module iPhone13"` |
| Second token | Browser: `Chrome` / `Firefox` / `Safari` | Device: `iPhone13` / `Pixel7` / … |
| Internal projects | `Module · Browser` | `Module-Device` |

---

## Tests by module

| Module | Specs |
|--------|--------|
| `StandardLoginFormMobileWebclient` | `login-page`, `login`, `auth-actions` |
| `MailMobileWebclient` | `mail*`, `compose*` |
| `ContactsMobileWebclient` | `contacts*` |
| `FilesMobileWebclient` | `files*` |
| `SettingsMobileWebclient` | `settings*` |

| Spec | What it checks |
|------|----------------|
| `login-page.spec.js` | Login form is visible |
| `login.spec.js` | Full login (Turnstile + credentials) |
| `auth-actions.spec.js` | Invalid password; forgot-password → back; logout→re-login; password visibility toggle |
| `mail.spec.js` | Inbox → open first message → back to list |
| `mail-actions.spec.js` | Message UI: details, star, reply/reply-all/forward open, search header |
| `mail-folders.spec.js` | Drawer → Inbox / Sent / Trash / Spam |
| `mail-mutations.spec.js` | Headers, move, spam / not spam, delete, send reply/forward, advanced search |
| `mail-list-actions.spec.js` | Unseen filter + clear; Starred; multi-select bulk delete; empty Trash |
| `mail-attachments.spec.js` | Compose + attach file → send → open in Sent → attachment list |
| `compose.spec.js` | Compose + send to `E2E_COMPOSE_TO` (or self) |
| `compose-draft.spec.js` | Save draft → reopen; send opened draft → Sent; discard unsaved on back |
| `compose-cc-bcc.spec.js` | Show CC/BCC, fill recipients, discard without sending |
| `mail-forward-resend.spec.js` | Forward as Attachment → compose; Resend → compose (when available) |
| `contacts.spec.js` | Contacts → open card → back to list |
| `contacts-actions.spec.js` | Drawer/storages switch, search, create/edit/delete contact, group CRUD, compose from email, share/unshare, find in mail |
| `contacts-select-actions.spec.js` | Multi-select bulk delete; multi-select compose; assign/remove from group; rename group |
| `contacts-extra-actions.spec.js` | Team storage browse; Send from contact menu |
| `files.spec.js` | Files → open file/folder → back |
| `files-actions.spec.js` | Drawer, search, upload+delete, rename, public link, move, create folder, create folder from move header |
| `files-select-actions.spec.js` | Copy into folder (original remains); multi-select bulk delete; share with teammates dialog; leave share via item menu |
| `files-extra-actions.spec.js` | Multi-select copy into folder; file download; rename folder via item menu |
| `settings.spec.js` | Settings menu (+ first tab) → logout → login form |
| `settings-actions.spec.js` | Every settings tab open/back; OpenPGP (+ My keys); Paranoid Encryption; Add account form (if visible) |
| `settings-auth.spec.js` | OpenPGP external keys + generate dialog (cancel); OpenPGP toggle+save; Paranoid controls visible |

---

## Known product bugs (E2E does not fix these; scenarios fail)

Do not work around these in tests — keep the happy-path assertion so the suite stays red until the product is fixed.

- **OpenPGP Generate dialog close (flaky)** — `settings-auth.spec.js`: X / Escape sometimes leave `settings-openpgp-generate-dialog` open (`AppDialog` + `persistent`). Retry usually passes.
