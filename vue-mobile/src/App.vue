<template>
  <q-layout view="hhh LpR fFf" style="height: 100vh">
    <router-view />
    <footer-component v-if="hasAuthToken" />
  </q-layout>
</template>
<script>
import { defineComponent } from 'vue';
import FooterComponent from "components/main/FooterComponent";

export default defineComponent({
  name: 'App',
  components: {
    FooterComponent,
  },
  async mounted() {
    await this.populate()
  },
  computed: {
    hasAuthToken() {
      return this.$store.getters['user/getAuthTokenStatus']
    }
  },
  watch: {
    hasAuthToken(hasAuthToken) {
      this.selectPath(hasAuthToken)
    }
  },
  methods: {
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
    }
  }
})
</script>
