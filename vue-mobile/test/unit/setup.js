import { config } from '@vue/test-utils'
import { Quasar, QBtn } from 'quasar'

/**
 * Quasar CLI auto-imports components via webpack; Vitest does not.
 * Register only what starter component tests need; extend as coverage grows.
 */
config.global.plugins = [
  [
    Quasar,
    {
      config: {},
      components: {
        QBtn,
      },
    },
  ],
]
