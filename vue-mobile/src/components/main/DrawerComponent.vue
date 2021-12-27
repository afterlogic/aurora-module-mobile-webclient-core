<template>
  <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" elevated>
    <q-item>
      <q-item-section class="text-subtitle1 q-mt-lg">
        {{ userName }}
      </q-item-section>
    </q-item>
    <q-separator />
    <div @click="test">
      <slot />
    </div>
  </q-drawer>
</template>

<script>
export default {
  name: "DrawerComponent",
  props: {
    value: { type: Boolean, default: false },
  },
  computed: {
    userName() {
      const user = this.$store.getters['core/getCurrentUser']
      return user?.PublicId ? user.PublicId : ''
    }
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
        this.closeDrawer(value)
      }
    }
  },
  methods: {
    closeDrawer(value) {
      this.$emit('closeDrawer', value)
    },
    test() {
      setTimeout(() => {
        this.leftDrawerOpen = false
      }, 300)
    }
  }
}
</script>

<style scoped>

</style>
