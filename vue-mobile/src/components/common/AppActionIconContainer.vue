<template>
  <div class="action-icon flex justify-center items-center">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AppActionIconContainer',
}
</script>

<style scoped>
.action-icon {
  width: 16px;
}
</style>
