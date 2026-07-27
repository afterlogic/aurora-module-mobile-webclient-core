<template>
  <q-btn
    v-bind="$attrs"
    class="q-py-xs full-width app-button"
    :size="size"
    :disable="disabled"
    unelevated
    no-caps
    bg-color="primary"
    rounded
    color="primary"
    :label="label"
    :ripple="ripple"
    :loading="loading"
  />
</template>

<script>
export default {
  name: 'AppButton',
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    size: { type: String, default: 'lg' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    ripple: { type: [Boolean, Object], default: true },
  },
}
</script>

<style lang="scss" scoped>
.app-button {
  height: 3rem;
  font-size: 0.875rem !important;

  &:active:not(.disabled) {
    opacity: 0.85;
  }
}
</style>
