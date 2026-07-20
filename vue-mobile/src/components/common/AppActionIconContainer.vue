<template>
  <div
    v-bind="$attrs"
    class="action-icon flex justify-center items-center"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AppActionIconContainer',
  inheritAttrs: false,
}
</script>

<style scoped>
.action-icon {
  width: 16px;
}
</style>
