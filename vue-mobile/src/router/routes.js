const routes = [
  {
    path: '/',
    component: () => import('src/views/pages/LoginMobile'),
  },
  {
    path: '/contacts',
    component: () => import('src/../../../ContactsMobileWebclient/vue-mobile/pages/Contacts'),
  },
  {
    path: '/files',
    component: () => import('src/../../../FilesMobileWebclient/vue-mobile/pages/Files'),
  },
  {
    path: '/file/:id',
    component: () => import('src/../../../FilesMobileWebclient/vue-mobile/pages/FileInfo'),
  },
  {
    path: '/mail',
    component: () => import('src/../../../MailMobileWebclient/vue-mobile/pages/Mail'),
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
