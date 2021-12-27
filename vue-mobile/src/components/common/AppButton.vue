<template>
    <q-btn
      class="q-py-xs full-width"
      size="lg"
      unelevated no-caps bg-color="primary" rounded color="primary"
      :label="label"
    />
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    label: { type: String, default: '' }
  },
}
</script>

<style scoped>

</style>
