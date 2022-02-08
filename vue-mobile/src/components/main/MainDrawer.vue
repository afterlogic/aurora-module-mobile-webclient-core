<template>
  <q-drawer
    v-model="leftDrawerOpen"
    side="left"
    overlay
    behavior="mobile"
    elevated
  >
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
import { mapGetters } from 'vuex'

export default {
  name: 'MainDrawer',
  props: {
    value: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters('core', ['currentUser']),
    userName() {
      return this.currentUser?.PublicId ? this.currentUser.PublicId : ''
    },
  },
  data() {
    return {
      leftDrawerOpen: false,
    }
  },
  watch: {
    value() {
      this.leftDrawerOpen = this.value
    },
    leftDrawerOpen(value) {
      if (!value) {
        this.closeDrawer(value)
      }
    },
  },
  methods: {
    closeDrawer(value) {
      this.$emit('closeDrawer', value)
    },
    test() {
      setTimeout(() => {
        this.leftDrawerOpen = false
      }, 300)
    },
  },
}
</script>

<style scoped></style>
