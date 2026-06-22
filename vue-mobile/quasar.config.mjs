/* eslint-env node */

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from '#q-app/wrappers'
import env from './env.cjs'

const quasarConfigDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(function (ctx) {
  return {
    supportTS: false,

    boot: [
      'mobile-cookie',
      'mobile-components',
      'i18n',
      'axios',
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons',
    ],

    build: {
      vueRouterMode: 'hash',
      publicPath: '/static/vue-mobile/',
      // App is served from site root (?mobile-version), not from /static/vue-mobile/
      vueRouterBase: '/',
      env: {
        API: ctx.dev ? env.API_ENDPOINT : '',
      },

      // Per-SFC auto-import patches `components` via lodash.extend after defineComponent,
      // wiping custom entries (MessageItem, AppInput, CreateContactIcon, …). Use globals only.
      chainWebpack (chain) {
        chain.module.rule('vue').uses.delete('vue-auto-import-quasar')
      },

      // Single vue/quasar instance across sync + async chunks.
      extendWebpack (cfg) {
        const dedupe = (name) => path.resolve(quasarConfigDir, 'node_modules', name)
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          vue: dedupe('vue'),
          'vue-router': dedupe('vue-router'),
          quasar: dedupe('quasar'),
        }
      },
    },

    devServer: {
      server: {
        type: 'http'
      },
      port: 8080,
      open: true
    },

    framework: {
      config: {},
      i18n: 'en',

      plugins: ['Notify'],

      directives: [
        'Ripple',
        'ClosePopup',
        'TouchHold',
        'Intersection',
      ],

      // Global registration — SFC auto-import is disabled (see chainWebpack above).
      components: [
        'QLayout',
        'QPageContainer',
        'QPage',
        'QHeader',
        'QFooter',
        'QDrawer',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnDropdown',
        'QForm',
        'QField',
        'QInput',
        'QSelect',
        'QCheckbox',
        'QToggle',
        'QOptionGroup',
        'QEditor',
        'QFile',
        'QDialog',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QSeparator',
        'QSpace',
        'QIcon',
        'QImg',
        'QChip',
        'QMenu',
        'QPopupProxy',
        'QScrollArea',
        'QVirtualScroll',
        'QPullToRefresh',
        'QTabs',
        'QRouteTab',
        'QTree',
        'QDate',
        'QBreadcrumbs',
        'QBreadcrumbsEl',
        'QUploader',
        'QLinearProgress',
        'QCircularProgress',
        'QSpinnerDots',
      ],
    },

    animations: [],

    ssr: {
      pwa: false,

      prodPort: 3000,

      maxAge: 1000 * 60 * 60 * 24 * 30,

      middlewares: [
        ctx.prod ? 'compression' : '',
        'render'
      ]
    },

    pwa: {
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {},

      manifest: {
        name: `Aurora`,
        short_name: `Aurora`,
        description: `A Quasar Project`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: {
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      bundler: 'packager',

      packager: {
      },

      builder: {
        appId: 'aurora'
      },

    }
  }
})
