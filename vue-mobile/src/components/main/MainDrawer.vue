<template>
  <q-drawer
    v-model="leftDrawerOpen"
    side="left"
    overlay
    behavior="mobile"
    elevated
  >
    <div>
      <slot />
    </div>
  </q-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import eventBus from "src/event-bus";
export default {
  name: 'MainDrawer',
  props: {
    value: { type: Boolean, default: false },
  },
  mounted() {
    eventBus.$on('closeDrawer', this.close)
  },
  computed: {
    ...mapGetters('core', ['userData', 'userPublicId']),
    userName() {
      if (this.userData) return this.userData.Name
      return ''
    },
    userEmail() {
      return this.userPublicId
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
    close() {
      setTimeout(() => {
        this.leftDrawerOpen = false
      }, 300)
    },
  },
  beforeMount() {
    eventBus.$off('closeDrawer', this.close)
  }
}
</script>

<style scoped>

</style>
