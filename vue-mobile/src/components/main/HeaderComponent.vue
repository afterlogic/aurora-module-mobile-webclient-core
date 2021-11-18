<template>
  <q-header elevated reveal class="bg-white" style="transform: none">
    <q-toolbar style="height: 55px">
      <q-btn flat size="15px" @click="$emit('openDrawer')" color="black" round dense icon="menu" />
      <q-toolbar-title class="text-black text-center">{{ title }}</q-toolbar-title>
      <q-btn flat size="15px" @click="$emit('openDrawer')" color="black" round dense icon="search" />
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: "HeaderComponent",
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' }
  }
}
</script>

<style scoped>

</style>
