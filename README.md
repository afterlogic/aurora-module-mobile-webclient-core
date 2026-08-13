# aurora-module-mobile-webclient-core
Mobile webclient for core view models

# Development
This repository has a pre-commit hook. To make it work you need to configure git to use the particular hooks folder.

```bash
git config --local core.hooksPath .githooks/
```

For all modules in an Aurora install at once:

```bash
./dev/batch.sh git config --local core.hooksPath .githooks/
```

The hook runs PHP checks (syntax, PhpStan, CS Fixer when available). If `vue-mobile/test/unit` exists and staged files touch `vue-mobile/`, it also runs `npm run test:unit` and blocks the commit on failure.

## Unit tests (Vitest)

```bash
cd vue-mobile
npm install
npm run test:unit
```

Details: [vue-mobile/test/unit/README.md](vue-mobile/test/unit/README.md).

Full install (every module that has `vue-mobile/test/unit`):

```bash
./dev/run-mobile-unit-tests.sh
```

## E2E tests (Playwright)

Runner lives in `vue-mobile/` (config, helpers, `.env.e2e`). Specs live in each
`modules/*/vue-mobile/test/e2e/`. Prefer launching from the **Aurora install root**:

```bash
npm run test:e2e-mobile              # full matrix
npm run test:e2e-mobile:ui           # Playwright UI Mode
npm run test:e2e-mobile -- --setup "MailMobileWebclient iPhone13"
```

Or from this module’s Quasar package:

```bash
cd vue-mobile
npm run test:e2e:ui -- --setup "StandardLoginFormMobileWebclient iPhone13"
npm run test:e2e:iphone
```

Full docs: [`vue-mobile/test/e2e/README.md`](vue-mobile/test/e2e/README.md).

Mobile uses `--setup "<modules> <devices>"` (like desktop). Second token is a **device**
(`iPhone13`), not a desktop browser name.

# License
This module is licensed under Afterlogic Software License.
