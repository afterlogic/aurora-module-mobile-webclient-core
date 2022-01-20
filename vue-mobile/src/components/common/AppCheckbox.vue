<template>
  <q-checkbox v-model="checked" :label="label" color="primary" :size="size" />
</template>

<script>
export default {
  name: 'AppCheckbox',
  props: {
    size: { type: String, default: 'md' },
    label: { type: String, default: '' },
  },
  data: () => ({
    checked: '',
  }),
}
</script>

<style scoped></style>
