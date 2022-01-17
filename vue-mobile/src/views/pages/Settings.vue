<template>
  <main-layout title="Settings">
    <div>
      <h4 @click="logout">logout</h4>
      <div>Setting 1</div>
      <div>Setting 2</div>
      <div>Setting 3</div>
      <div>Setting 4</div>
      <div>Setting 5</div>
      <div>Setting 6</div>
      <div>Setting 7</div>
    </div>
  </main-layout>
</template>

<script>
import MainLayout from 'src/views/layouts/MainLayout'

export default {
  name: 'Settings',
  components: {
    MainLayout,
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
  },
}
</script>

<style scoped></style>
