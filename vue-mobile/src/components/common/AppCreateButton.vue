<template>
  <q-btn
    style="position: fixed; z-index: 1; bottom: 10%; right: 5%"
    color="primary"
    size="17px"
    :icon="icon"
    round
  />
</template>

<script>
export default {
  name: 'AppCreateButton',
  props: {
    icon: { type: String, default: '' },
  },
}
</script>

<style scoped></style>
