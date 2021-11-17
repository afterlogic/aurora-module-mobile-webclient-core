<template>
    <q-btn size="20px" flat round :icon="icon" @click="$router.replace(url)"/>
</template>

<script>
export default {
  name: "MenuButton",
  props: {
    icon: { type: String, default: 'my_location' },
    url: { type: String, default: '' }
  }
}
</script>

<style scoped>

</style>
