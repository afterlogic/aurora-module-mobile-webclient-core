<template>
  <main-header @openDrawer="leftDrawerOpen = !leftDrawerOpen"></main-header>
  <main-drawer :value="leftDrawerOpen" @closeDrawer="closeDrawer">
    <slot name="drawer" />
  </main-drawer>
  <q-page-container style="overflow: hidden" class="full-height">
    <q-page>
      <slot />
    </q-page>
  </q-page-container>
  <main-footer></main-footer>
</template>

<script>
import MainHeader from 'components/main/MainHeader'
import MainDrawer from 'components/main/MainDrawer'
import MainFooter from 'components/main/MainFooter'

export default {
  name: 'MainLayout',

  components: {
    MainHeader,
    MainDrawer,
    MainFooter,
  },

  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },

  data() {
    return {
      leftDrawerOpen: false,
    }
  },

  methods: {
    closeDrawer(value) {
      this.leftDrawerOpen = value
    },
  },
}
</script>
