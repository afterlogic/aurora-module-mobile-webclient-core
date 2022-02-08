<template>
  <component :is="footerModuleComponent"></component>
</template>

<script>
import { shallowRef } from 'vue'

import modulesManager from 'src/modules-manager'

import DefaultFooter from 'components/main/DefaultFooter'

export default {
  name: 'MainFooter',

  setup() {
    let footerModuleComponent = shallowRef(DefaultFooter)
    modulesManager.getPageFooterComponent().then(component => {
      if (component) {
        footerModuleComponent.value = component
      }
    })
    return {
      footerModuleComponent: footerModuleComponent,
    }
  },
}
</script>

<style scoped></style>
