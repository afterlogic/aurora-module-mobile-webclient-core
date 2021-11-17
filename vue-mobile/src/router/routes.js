
const routes = [
  {
    path: '/',
    component: () => import('src/views/layouts/MainLayout.vue'),
  },
  {
    path: '/files',
    component: () => import('src/views/pages/Files'),
  },
  {
    path: '/mail',
    component: () => import('src/views/pages/Mail'),
  },
  {
    path: '/settings',
    component: () => import('src/views/pages/Settings'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/views/pages/Error404.vue')
  }
]

export default routes
