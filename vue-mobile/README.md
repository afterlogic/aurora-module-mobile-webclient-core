# Aurora (aurora)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).

### Unit / component tests (Vitest)

```bash
yarn test:unit
```

Pipeline, when to write tests, and CI: see [test/unit/README.md](test/unit/README.md).

### E2E tests (Playwright)

From this package:

```bash
yarn test:e2e:ui -- --setup "MailMobileWebclient iPhone13"
yarn test:e2e_local:iphone
yarn build-production   # after Vue / data-test-id changes
```

From the Aurora install root (preferred for Playwright):

```bash
yarn test:e2e-mobile
yarn test:e2e-mobile:ui
yarn test:e2e-mobile -- --setup "MailMobileWebclient iPhone13"
```

Full docs: [test/e2e/README.md](test/e2e/README.md) and install-root [README-e2e-mobile.md](../../../README-e2e-mobile.md).
