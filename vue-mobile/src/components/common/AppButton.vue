<template>
  <q-btn
    class="q-py-xs full-width"
    :size="size"
    :disable="disabled"
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
    disabled: { type: Boolean, default: false },
  },
}
</script>

<style scoped></style>
