<template>
  <q-header reveal class="bg-black" style="transform: none">
    <q-toolbar>
      <q-btn flat @click="$emit('openDrawer')" round dense icon="menu" />
      <q-toolbar-title>{{ title }}</q-toolbar-title>
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
