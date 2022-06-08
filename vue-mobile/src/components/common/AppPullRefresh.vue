<template>
  <q-pull-to-refresh
    @refresh="refresh"
    color="primary"
    icon="refresh"
  >
    <slot />
  </q-pull-to-refresh>
</template>

<script>
export default {
  name: "AppPullRefresh",
  props: {
    refreshAction: { type: Function, default: () => null }
  },
  methods: {
    async refresh() {
      await this.refreshAction()
    }
  }
}
</script>

<style scoped>
</style>
