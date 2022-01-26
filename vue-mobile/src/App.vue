<template>
  <q-layout view="hhh LpR fFf" style="height: 100vh">
    <uploader-component ref="uploader" />
    <router-view />
    <footer-component v-if="hasAuthToken && $route.fullPath !== '/'" />
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { defineComponent } from 'vue'
import FooterComponent from 'components/main/FooterComponent'
import UploaderComponent from 'components/files/common/UploaderComponent'
import settings from 'src/settings'
import VueCookies from 'vue-cookies'

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
      if (!hasAuthToken) this.$router.push('/')
      // this.selectPath(hasAuthToken)
    },
  },
  methods: {
    ...mapActions('user', ['getUsedDevices']),
    async populate() {
      this.checkToken()
      await this.selectPath(this.hasAuthToken)
    },
    async selectPath(hasAuthToken) {
      const data = settings.getTwoFactorData()
      const deviceId = VueCookies.get('DeviceId')
      let isDevice = false
      if (hasAuthToken) {
        const deviceData = await this.getUsedDevices({})
        isDevice = !!deviceData.find((device) => device.DeviceId === deviceId)
      }
      console.log('DB: data', data)
      console.log(
        'DB: hasAuthToken',
        hasAuthToken,
        data.allowUsedDevices,
        isDevice
      )
      if (
        (hasAuthToken && (!data.allowUsedDevices || isDevice)) ||
        (data.allowUsedDevices === undefined && hasAuthToken)
      ) {
        await this.$router.push('/mail')
      } else {
        await this.$router.push('/')
      }
    },
    checkToken() {
      this.$store.dispatch('user/init')
    },
  },
})
</script>
