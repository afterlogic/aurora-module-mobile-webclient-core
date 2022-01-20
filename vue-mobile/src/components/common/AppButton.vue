<template>
  <q-btn
    class="q-py-xs full-width app-button"
    :size="size"
    :disable="disabled"
    unelevated
    no-caps
    bg-color="primary"
    rounded
    color="primary"
    :label="label"
    :ripple="false"
    :loading="loading"
  />
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    label: { type: String, default: '' },
    size: { type: String, default: 'lg' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
.app-button {
  height: 3rem;
  font-size: 0.875rem !important;
}
</style>
