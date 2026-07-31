<template>
  <q-btn
    class="text-no-wrap"
    no-caps
    size="14px"
    flat
    color="primary"
    :disable="saving || disabled"
    @click="action"
    label="Create shareable link"
  />
</template>

<script>
export default {
  name: 'ButtonDialog',
  props: {
    saving: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    action: { type: Function, default: null },
  },
}
</script>
