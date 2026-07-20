<template>
  <q-btn
    v-bind="$attrs"
    size="20px"
    flat
    round
    @click="$router.replace(url)"
  >
    <slot />
  </q-btn>
</template>

<script>
export default {
  name: 'MenuButton',
  inheritAttrs: false,
  props: {
    url: { type: String, default: '' },
  },
}
</script>
