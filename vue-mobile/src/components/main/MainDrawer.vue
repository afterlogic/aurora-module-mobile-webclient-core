<template>
  <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" elevated>
    <div>
      <slot />
    </div>
  </q-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

import eventBus from 'src/event-bus'

export default {
  name: 'MainDrawer',

  mounted() {
    eventBus.$on('closeDrawer', this.close)
    eventBus.$on('openDrawer', this.open)
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

  methods: {
    close() {
      setTimeout(() => {
        this.leftDrawerOpen = false
      }, 300)
    },

    open() {
      this.leftDrawerOpen = true
    },
  },

  unmounted() {
    console.log('unmounted')
    eventBus.$off('openDrawer', this.open)
    eventBus.$off('closeDrawer', this.close)
  },
}
</script>

<style scoped></style>
