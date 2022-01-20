<template>
  <q-input
    class="q-pt-sm"
    model-value=""
    :filled="filled"
    v-model="text"
    :placeholder="placeholder"
    lazy-rules
    :rules="rules"
    label-color="yellow-5"
    hide-bottom-space
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
  },
}
</script>

<style scoped></style>
