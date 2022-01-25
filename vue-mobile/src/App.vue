<template>
  <q-layout view="hhh LpR fFf" style="height: 100vh">
    <uploader-component ref="uploader" />
    <router-view />
    <footer-component v-if="hasAuthToken && $route.fullPath !== '/'" />
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import FooterComponent from 'components/main/FooterComponent'

const mixins = {
  methods: {
    uploadFiles(methods) {
      this.$refs.uploader.open(methods)
    },
  },
}

import UploaderComponent from 'components/files/common/UploaderComponent'
import { mapGetters } from 'vuex'
import settings from 'src/settings'

export default defineComponent({
  mixins: [mixins],
  name: 'App',
  components: {
    UploaderComponent,
    FooterComponent,
  },
  async mounted() {
    await this.populate()
  },
  computed: {
    ...mapGetters('core', ['locale']),
    hasAuthToken() {
      return this.$store.getters['user/getAuthTokenStatus']
    },
  },
  watch: {
    locale(lang) {
      this.$i18n.locale = lang
    },
    hasAuthToken(hasAuthToken) {
      this.selectPath(hasAuthToken)
    },
  },
  methods: {
    async populate() {
      this.checkToken()
      this.selectPath(this.hasAuthToken)
    },
    selectPath(hasAuthToken) {
      const data = settings.getTwoFactorData()
      if (hasAuthToken && !data.allowUsedDevices) {
        this.$router.replace('/mail')
      } else {
        this.$router.replace('/')
      }
    },
    checkToken() {
      this.$store.dispatch('user/init')
    },
  },
})
</script>
