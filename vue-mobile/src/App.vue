<template>
  <q-layout view="hhh LpR fFf" style="height: 100vh">
    <uploader-component ref="uploader" />
    <router-view />
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'

import modulesManager from 'src/modules-manager'
import typesUtils from 'src/utils/types'

import UploaderComponent from 'components/common/UploaderComponent'

const mixins = {
  methods: {
    uploadFiles(methods) {
      this.$refs.uploader.open(methods)
    },
  },
}

export default defineComponent({
  mixins: [mixins],

  name: 'App',

  components: {
    UploaderComponent,
  },

  computed: {
    ...mapGetters('core', ['locale', 'isUserNormalOrTenant']),
  },

  watch: {
    locale(lang) {
      this.$i18n.locale = lang
    },

    isUserNormalOrTenant () {
      const currentRoute = this.$router.currentRoute.value
      const currentPath = currentRoute?.path
      const matchedRoutes = typesUtils.pArray(currentRoute?.matched)
      const correctedPath = modulesManager.correctPathForUser(matchedRoutes)
      if (matchedRoutes.length > 0 && currentPath !== correctedPath) {
        this.$router.push(correctedPath)
      }
    },
  },
})
</script>
