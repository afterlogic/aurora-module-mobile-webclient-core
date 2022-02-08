<template>
  <q-footer elevated class="bg-white">
    <q-toolbar class="flex justify-between" style="height: 60px">
      <menu-button v-for="buttonData in footerButtons" :key="buttonData.pagePath" :url="buttonData.pagePath">
        <component :is="buttonData.iconComponent" :color="buttonData.highlightPaths.indexOf(currentPath) !== -1 ? '#469CF8' : '#B6B5B5'"></component>
      </menu-button>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { shallowRef } from 'vue'

import modulesManager from 'src/modules-manager'

import MenuButton from 'components/common/MenuButton'

export default {
  name: 'DefaultFooter',

  components: {
    MenuButton,
  },

  setup() {
    let footerButtons = shallowRef(null)
    modulesManager.getPageFooterButtons().then(footerButtonsValue => {
      footerButtons.value = footerButtonsValue
    })
    return {
      footerButtons,
    }
  },

  computed: {
    currentPath () {
      const path = this.$route.fullPath.split('/')
      return path.length >1 ? '/' + path[1] : '/'
    },
  },
}
</script>

<style scoped></style>
