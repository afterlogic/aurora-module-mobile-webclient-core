import { reactive, ref, watch } from 'vue'

const not = (val) => !val

export function useField(field) {
  const valid = ref(true)
  const value = ref(field.value)
  const rules = reactive({})

  const reassign = (val) => {
    valid.value = true
    Object.keys(field.validators ?? {}).map((name) => {
      const isValid = field.validators[name](val)
      rules[name] = not(isValid)
      if (not(isValid)) {
        valid.value = false
      }
    })
  }
  watch(value, reassign)
  reassign(field.value)

  return { value, valid, rules }
}
