<template>
  <q-layout view="hhh LpR fFf" style="height: 100vh">
    <uploader-component ref="uploader" />
    <router-view />
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'

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
    ...mapGetters('core', ['locale']),
    ...mapGetters('user', ['isUserNormalOrTenant']),
  },

  watch: {
    locale(lang) {
      this.$i18n.locale = lang
    },

    isUserNormalOrTenant (isUserNormalOrTenant) {
      const currentPath = this.$router.currentRoute && this.$router.currentRoute.path ? this.$router.currentRoute.path : ''
      console.log('currentPath', currentPath)
      if (isUserNormalOrTenant) {
        if (currentPath !== '/mail') {
          this.$router.push('/mail')
        }
      } else {
        if (currentPath !== '/') {
          this.$router.push('/')
        }
      }
    },
  },
})
</script>
