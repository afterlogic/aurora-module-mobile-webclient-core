<template>
  <q-input
    class="q-pt-sm"
    :dense="dense"
    :filled="filled"
    :model-value="modelValue"
    :placeholder="placeholder"
    :label="label"
    lazy-rules
    :rules="rules"
    hide-bottom-space
    :autofocus="autofocus"
    :type="type"
    :disable="disable"
    stack-label
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script>
import { errors } from 'src/utils/validation'

export default {
  name: 'AppInput',

  props: {
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    rulesProps: { type: Object, default: null },
    filled: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    disable: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    type: { type: String, default: 'text' },
  },

  emits: ['update:modelValue'],

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
