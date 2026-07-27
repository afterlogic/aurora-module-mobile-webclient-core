# Mobile E2E (Playwright)

Unit / component tests (Vitest, no server): see [`../test/unit/README.md`](../test/unit/README.md).

**Layout:** this package (`CoreMobileWebclient/vue-mobile`) is the **runner**
(config, shared helpers, browsers, `.env.e2e`). Scenarios live in modules:

```text
modules/<MobileWebclient>/vue-mobile/test/e2e/*.spec.js
modules/<MobileWebclient>/vue-mobile/test/e2e/helpers/   # domain helpers
modules/CoreMobileWebclient/vue-mobile/e2e/helpers/     # login, ready, paths
modules/CoreMobileWebclient/vue-mobile/e2e/fixtures/
```

`playwright.config.js` discovers every `modules/*/vue-mobile/test/e2e` with
`*.spec.js` and builds projects `ModuleName · <device>`.

## Preconditions

1. Local Aurora is running (MAMP or equivalent).
2. Document Root points at the project root.
3. Mobile UI opens in a browser: `http://localhost:8888/?mobile-version`

## Run

Use **Yarn classic (1.x)** and preferably **Node 18 or 22** (not Node 24).
Yarn Berry (4.x) rewrites `yarn.lock` and breaks `quasar build` (`Unknown keyword formatMinimum`).

```bash
cd modules/CoreMobileWebclient/vue-mobile
nvm use 22                    # if you use nvm
yarn -v                       # expect 1.22.x
yarn test:e2e:install-browsers
yarn build-production         # after changing Vue files (data-test-id, etc.)
yarn test:e2e_local           # full device × module matrix
yarn test:e2e_local:iphone    # all modules · iPhone 13 Chromium
yarn test:e2e_local:webkit    # all modules · iPhone SE/13 WebKit
yarn test:e2e                 # Playwright + email-report stub after run
yarn test:e2e:report
```

### Device matrix

| Project suffix | Engine | Device preset | Viewport |
|----------------|--------|---------------|----------|
| `iPhone SE` | Chromium | `iPhone SE` | 320×568 |
| `iPhone 13` | Chromium | `iPhone 13` | 390×664 (baseline) |
| `Pixel 7` | Chromium | `Pixel 7` | 412×839 |
| `iPhone SE WebKit` | WebKit | `iPhone SE` | 320×568 |
| `iPhone 13 WebKit` | WebKit | `iPhone 13` | 390×664 |

Filter examples:

```bash
yarn test:e2e_local -- --project="MailMobileWebclient · iPhone 13"
yarn test:e2e_local -- --project="*iPhone 13"
yarn test:e2e_local -- --project="ContactsMobileWebclient*"
yarn test:e2e_local -- contacts-select-actions.spec.js --project="*iPhone SE"
```

In the console: steps like `→ Open mobile login page`.
HTML report: timeline, screenshots on failure, **Trace** replay.

Flaky mitigation (config/helpers):
- 1 automatic retry
- clean session before login
- wait for Turnstile token
- wait for footer `nav-mail` after login
- shared list-ready waits
- compose recipient: `.first()` option + wait for dialog close

```bash
yarn test:e2e:ui
```

## Adding a module suite

1. Create `modules/YourMobileWebclient/vue-mobile/test/e2e/` with `*.spec.js`.
2. Import shared helpers:

```js
const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(
  path.join(process.env.AURORA_MOBILE_E2E_ROOT, 'e2e/helpers/paths')
)
const { loginAsTestUser } = sharedHelper('login')
```

3. Re-run — discovery picks it up (no config edit).

## Credentials (login test)

```bash
cp .env.e2e.example .env.e2e
# edit E2E_LOGIN and E2E_PASSWORD
```

`.env.e2e` is gitignored. Playwright loads it automatically.

## Custom URL

```bash
PLAYWRIGHT_BASE_URL=http://localhost:8888/?mobile-version yarn test:e2e_local
```

If MAMP is not running, the test fails with a connection error — start the server and retry.

After changing Vue files used by mobile, rebuild mobile assets before re-running E2E.

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
| `files-actions.spec.js` | Drawer, search, upload+delete, rename, public link, move, create folder |
| `files-select-actions.spec.js` | Copy into folder (original remains); multi-select bulk delete; share with teammates dialog; leave share via item menu |
| `files-extra-actions.spec.js` | Multi-select copy into folder; file download; rename folder via item menu |
| `settings.spec.js` | Settings menu (+ first tab) → logout → login form |
| `settings-actions.spec.js` | Every settings tab open/back; OpenPGP (+ My keys); Paranoid Encryption; Add account form (if visible) |
| `settings-auth.spec.js` | OpenPGP external keys + generate dialog (cancel); OpenPGP toggle+save; Paranoid controls visible |

## Known product bugs (E2E does not fix these; scenarios fail)

Do not work around these in tests — keep the happy-path assertion so the suite stays red until the product is fixed.

- **OpenPGP Generate dialog close (flaky)** — `settings-auth.spec.js`: X / Escape sometimes leave `settings-openpgp-generate-dialog` open (`AppDialog` + `persistent`). Retry usually passes.
