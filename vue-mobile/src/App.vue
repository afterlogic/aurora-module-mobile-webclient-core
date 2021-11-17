<template>
  <q-layout view="hhh LpR fFf">
    <router-view />
    <footer-component />
  </q-layout>
</template>
<script>
import { defineComponent } from 'vue';
import FooterComponent from "components/main/FooterComponent";

export default defineComponent({
  name: 'App',
  components: {
    FooterComponent,
  }
})
</script>
