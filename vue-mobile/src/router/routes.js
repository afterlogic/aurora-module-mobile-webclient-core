const routes = [
  {
    path: '/',
    component: () => import('src/views/pages/LoginMobile'),
  },
  {
    path: '/contacts',
    component: () => import('src/views/pages/Contacts'),
  },
  {
    path: '/files',
    component: () => import('src/views/pages/files/Files'),
  },
  {
    path: '/file/:id',
    component: () => import('src/views/pages/files/FileInfo'),
  },
  {
    path: '/mail',
    component: () => import('src/views/pages/Mail'),
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
