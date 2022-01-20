<template>
  <q-layout view="hhh LpR fFf" style="height: 100vh">
    <uploader-component ref="uploader" />
    <router-view />
  </q-layout>
</template>
<script>
import { defineComponent } from 'vue'

const mixins = {
  methods: {
    uploadFiles(methods) {
      this.$refs.uploader.open(methods)
    },
  },
}

import UploaderComponent from 'components/files/common/UploaderComponent'
import { mapActions, mapGetters } from 'vuex'
export default defineComponent({
  mixins: [mixins],
  name: 'App',
  components: {
    UploaderComponent,
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
    ...mapActions('core', ['changeLocale']),
    async populate() {
      this.checkToken()
      this.selectPath(this.hasAuthToken)
      await this.init()
    },
    selectPath(hasAuthToken) {
      if (hasAuthToken) {
        this.$router.replace('/mail')
      } else {
        this.$router.replace('/')
      }
    },
    checkToken() {
      this.$store.dispatch('user/init')
    },
    async init() {
      await this.$store.dispatch('core/init')
    },
  },
})
</script>
