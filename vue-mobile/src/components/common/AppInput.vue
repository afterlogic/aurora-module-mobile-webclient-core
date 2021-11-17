<template>
  <q-input v-model="text" @input="$emit('input', text)" :placeholder="placeholder"/>
</template>

<script>
export default {
  name: 'AppInput',
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  },
  data() {
    return {
      text: ''
    }
  },
  watch: {
    value(val) {
      this.text = val
    }
  }
}
</script>

<style scoped>

</style>
