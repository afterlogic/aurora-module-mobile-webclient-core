<template>
  <q-input
    class="q-pt-sm"
    model-value=""
    :filled="filled"
    v-model="text"
    :placeholder="placeholder"
    lazy-rules
    :rules="rules"
    hide-bottom-space
    :autofocus="autofocus"
    :type="type"
    v-on:input="$emit('input', $event.target.value)"
  />
</template>

<script>
import { errors } from 'src/utils/validation'

export default {
  name: 'AppInput',
  props: {
    placeholder: { type: String, default: '' },
    rulesProps: { type: Object, default: null },
    filled: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    type: { type: String, default: 'text' },
  },
  data: () => ({
    text: '',
  }),
  computed: {
    rules() {
      const rules = []
      if (this.rulesProps) {
        Object.keys(this.rulesProps).forEach((key) => {
          if (this.rulesProps[key]) {
            rules.push(() => !this.rulesProps[key] || errors[key])
          }
        })
      }
      return rules.length ? rules : [true]
    },
}
}
</script>

<style scoped></style>
