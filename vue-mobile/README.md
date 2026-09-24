# Aurora (aurora)

A Quasar Project

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
npm run lint
```


### Format the files
```bash
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
npm run test:unit
```

Pipeline, when to write tests, and CI: see [test/unit/README.md](test/unit/README.md).

### E2E tests (Playwright)

From the Aurora install root, pick the **Mobile** suite in the launcher:

```bash
npm run test:e2e:tui
```

After Vue / `data-test-id` changes run `npm run build-production` here first.

Setup and details: [test/e2e/README.md](test/e2e/README.md).
