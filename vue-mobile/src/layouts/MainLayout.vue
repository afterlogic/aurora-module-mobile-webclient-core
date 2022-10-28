<template>
  <q-header elevated reveal class="bg-white" style="transform: none">
    <slot name="header" />
  </q-header>
  <main-drawer>
    <slot name="drawer" />
  </main-drawer>
  <q-page-container class="full-height">
    <q-page>
      <slot />
    </q-page>
  </q-page-container>
  <main-footer></main-footer>
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
}
</script>
