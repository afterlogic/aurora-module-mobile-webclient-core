<template>
  <q-header elevated reveal class="bg-white" style="transform: none">
    <slot name="header" />
  </q-header>
  <MainDrawer>
    <slot name="drawer" />
  </MainDrawer>
  <q-page-container class="full-height">
    <q-page :style-fn="pageStyles">
      <slot />
    </q-page>
  </q-page-container>
  <MainFooter></MainFooter>
</template>

<script>
import MainDrawer from 'components/main/MainDrawer'
import MainFooter from 'components/main/MainFooter'

export default {
  name: 'MainLayout',

  components: {
    MainDrawer,
    MainFooter,
  },

  methods: {
    pageStyles (offset) {
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration

      // this is actually what the default style-fn does in Quasar
      return { 'flex-wrap': 'nowrap' }
    }
  }
}
</script>
