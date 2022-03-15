<template>
  <q-checkbox
    model-value=""
    v-bind="$attrs"
    :left-label="leftLabel"
    :label="label"
    color="primary"
    :size="size"
    keep-color
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
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  /* identical to box height, or 114% */

  letter-spacing: 0.3px;

  /* Main text color */

  color: #000000;
}
</style>
