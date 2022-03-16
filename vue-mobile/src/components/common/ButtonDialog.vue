<template>
  <q-btn
    class="text-no-wrap button-dialog"
    no-caps
    size="14px"
    flat
    color="primary"
    :disable="saving"
    @click="action"
  />
</template>

<script>
export default {
  name: 'ButtonDialog',
  props: {
    saving: { type: Boolean, default: false },
    action: { type: Function, default: null },
  },
}
</script>

<style scoped>
.button-dialog {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
}
</style>
