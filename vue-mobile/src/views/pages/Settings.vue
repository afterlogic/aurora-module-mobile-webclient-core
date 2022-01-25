<template>
  <main-layout title="Settings">
    <router-view />
  </main-layout>
</template>

<script>
import MainLayout from 'src/views/layouts/MainLayout'

export default {
  name: 'Settings',
  // created() {
  //   this.$router.push('/settings/menu')
  // },
  components: {
    MainLayout,
  },
}
</script>

<style scoped></style>
