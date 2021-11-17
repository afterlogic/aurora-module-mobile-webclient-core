<template>
  <q-layout view="hhh LpR fFf">
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
  mounted() {
    this.init()
    if (this.hasAuthToken) {
      this.$router.replace('/mail')
    } else {
      this.$router.replace('/')
    }
  },
  computed: {
    hasAuthToken() {
      return this.$store.getters['user/getAuthTokenStatus']
    }
  },
  watch: {
    hasAuthToken(hasAuthToken) {
      if (hasAuthToken) {
        this.$router.replace('/mail')
      } else {
        this.$router.replace('/')
      }
    }
  },
  methods: {
    init() {
      this.$store.dispatch('user/init')
    }
  }
})
</script>
