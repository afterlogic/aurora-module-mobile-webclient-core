<template>
  <q-btn size="20px" flat round @click="$router.replace(url)">
    <slot />
  </q-btn>
</template>

<script>
export default {
  name: 'MenuButton',
  props: {
    url: { type: String, default: '' },
  },
}
</script>

<style scoped></style>
