<template>
  <div class="full-width">
    <div class="q-px-md text-bold text-black text placeholder">
      <span>{{ placeholder }}</span>
    </div>
    <q-input
      v-bind="$attrs"
      @input="$emit('input', $event)"
      class="q-ma-md"
      outlined
      dense
    />
  </div>
</template>

<script>
export default {
  name: 'AppDialogInput',
  props: {
    placeholder: { type: String, default: '' },
  },
}
</script>

<style scoped>
.placeholder {
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  color: #000000;
}
</style>
