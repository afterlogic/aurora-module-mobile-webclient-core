import { defineBoot } from '#q-app/wrappers'
import VueCookies from 'vue-cookies'

export default defineBoot(() => {
  // Ensure mobile module list from API (overrides aurora-mobile=0 from adminpanel).
  VueCookies.set('aurora-mobile', '1', '200d', '/')
})
