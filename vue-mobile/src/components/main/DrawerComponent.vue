<template>
  <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" elevated>
    <q-scroll-area class="fit">
      <div class="q-pa-sm">
        <div v-for="n in 10" :key="n">Drawer {{ n }} / 50</div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
export default {
  name: "DrawerComponent",
  props: {
    value: { type: Boolean, default: false },
  },
  data() {
    return {
      leftDrawerOpen: false,
    }
  },
  watch: {
    value() {
      this.leftDrawerOpen = this.value;
    },
    leftDrawerOpen(value) {
      if (!value) {
        this.$emit('closeDrawer', value)
      }
    }
  },
}
</script>

<style scoped>

</style>
