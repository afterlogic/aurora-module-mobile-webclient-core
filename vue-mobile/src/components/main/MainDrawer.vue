<template>
  <q-drawer
    v-model="leftDrawerOpen"
    side="left"
    overlay
    behavior="mobile"
    elevated
  >
    <q-item class="user-info flex column q-mb-xs">
      <div v-if="userName" class="user-name q-mx-md q-mb-xs">
        {{ userName }}
      </div>
      <div :class="`q-mx-md ${!userName ? 'user-name q-mb-xs' : 'user-email'}`">
        {{ userEmail }}
      </div>
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
    test() {
      setTimeout(() => {
        this.leftDrawerOpen = false
      }, 300)
    },
  },
}
</script>

<style scoped>
.user-info {
  padding-top: 36px;
}
.user-email {
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  color: rgba(0, 0, 0, 0.6);
}
.user-name {
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  color: #000000;
}
</style>
