const routes = [
  {
    path: '/',
    component: () => import('src/views/pages/LoginMobile'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/views/pages/Error404.vue'),
  },
]

export default routes
