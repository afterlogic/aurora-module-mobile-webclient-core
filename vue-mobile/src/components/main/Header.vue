<template>
  <q-header elevated reveal class="bg-white" style="transform: none">
    <component :is="headerModuleComponent" @openDrawer="$emit('openDrawer')"></component>
  </q-header>
</template>

<script>
import { shallowRef, triggerRef } from 'vue'

import modulesManager from 'src/modules-manager'

export default {
  name: 'Header',

  setup() {
    let headerModuleComponent = shallowRef(null)
    modulesManager.getPageHeaderComponent().then(component => {
      headerModuleComponent.value = component
      triggerRef(headerModuleComponent)
    })
    return {
      headerModuleComponent,
    }
  },
}
</script>

<style scoped></style>
