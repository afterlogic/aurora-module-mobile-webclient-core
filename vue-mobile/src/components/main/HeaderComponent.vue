<template>
  <q-header elevated reveal class="bg-white" style="transform: none">
    <component :is="headerModuleComponent" @openDrawer="$emit('openDrawer')"></component>
  </q-header>
</template>

<script>

import modulesManager from 'src/modules-manager'

export default {
  name: 'HeaderComponent',

  data() {
    return {
      headerModuleComponent: null,
    }
  },

  mounted () {
    this.getHeaderModuleComponent()
  },

  methods: {
    async getHeaderModuleComponent () {
      const currentPageName = this.$route.fullPath.split('/')[1]
      this.headerModuleComponent = await modulesManager.getPageHeaderComponent(currentPageName)
    },
  },

}
</script>

<style scoped></style>
