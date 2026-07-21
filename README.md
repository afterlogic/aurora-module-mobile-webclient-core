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

The hook runs PHP checks (syntax, PhpStan, CS Fixer when available). If `vue-mobile/test/unit` exists and staged files touch `vue-mobile/`, it also runs `yarn test:unit` and blocks the commit on failure.

## Unit tests (Vitest)

```bash
cd vue-mobile
yarn
yarn test:unit
```

Details: [vue-mobile/test/unit/README.md](vue-mobile/test/unit/README.md).

Full install (every module that has `vue-mobile/test/unit`):

```bash
./dev/run-mobile-unit-tests.sh
```

# License
This module is licensed under Afterlogic Software License.
