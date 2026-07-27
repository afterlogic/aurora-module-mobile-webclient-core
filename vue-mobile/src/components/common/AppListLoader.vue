<template>
  <div
    class="app-list-loader"
    :class="{
      'app-list-loader_initial': initial,
      'app-list-loader_inline': !initial,
    }"
  >
    <q-spinner-dots color="primary" size="40px" />
  </div>
</template>

<script>
export default {
  name: 'AppListLoader',

  props: {
    initial: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.app-list-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  &_initial {
    flex: 1 1 auto;
    min-height: 0;
  }

  &_inline {
    padding: 16px 0;
  }
}
</style>
