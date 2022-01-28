const routes = [
  {
    path: '/',
    component: () => import('src/views/pages/LoginMobile'),
  },
  {
    path: '/settings',
    component: () => import('src/views/pages/Settings'),
    children: [
      {
        path: '/settings/menu',
        component: () => import('src/components/settings/SettingsMenu'),
      },
      {
        path: '/settings/paranoid-encryption',
        component: () =>
          import('src/components/settings/paranoid/ParanoidEncryption'),
      },
      {
        path: '/settings/open-pgp',
        component: () => import('src/components/settings/pgp/OpenPgp'),
      },
      {
        path: '/settings/open-pgp/external-keys',
        component: () => import('src/components/settings/pgp/ExternalKeys'),
      },
      {
        path: '/settings/open-pgp/external-keys/:key',
        component: () => import('src/components/settings/pgp/KeyComponent'),
      },
      {
        path: '/settings/open-pgp/my-keys',
        component: () => import('src/components/settings/pgp/KeysComponent'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/views/pages/Error404.vue'),
  },
]

export default routes
