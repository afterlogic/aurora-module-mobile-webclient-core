<template>
  <q-checkbox
    model-value=""
    v-bind="$attrs"
    :left-label="leftLabel"
    :label="label"
    color="primary"
    :size="size"
  />
</template>

<script>
export default {
  name: 'AppCheckbox',
  props: {
    size: { type: String, default: 'md' },
    label: { type: String, default: '' },
    leftLabel: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
.q-checkbox {
  width: 100%;
  justify-content: space-between;
}
</style>
