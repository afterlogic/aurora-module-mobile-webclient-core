<template>
  <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" elevated>
    <div>
      <slot />
    </div>
  </q-drawer>
</template>

<script>
import { mapState } from 'pinia'

import { useCoreStore } from 'src/stores/index-pinia'

import eventBus from 'src/event-bus'

export default {
  name: 'MainDrawer',

  mounted() {
    eventBus.$on('closeDrawer', this.close)
    eventBus.$on('openDrawer', this.open)
  },

  computed: {
    ...mapState(useCoreStore, ['userData', 'userPublicId']),

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
    eventBus.$off('openDrawer', this.open)
    eventBus.$off('closeDrawer', this.close)
  },
}
</script>
