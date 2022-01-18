<template>
  <q-btn
    class="q-py-xs full-width"
    :size="size"
    :disable="disable"
    unelevated
    no-caps
    bg-color="primary"
    rounded
    color="primary"
    :label="label"
  />
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    label: { type: String, default: '' },
    size: { type: String, default: 'lg' },
    disable: { type: Boolean, default: false },
  },
}
</script>

<style scoped></style>
