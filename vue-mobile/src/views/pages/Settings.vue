<template>
  <main-layout title="Settings">
    <div>
      <h4 @click="logout">logout</h4>
      <div>
        {{ $i18n.t('COREWEBCLIENT.CONFIRM_DISCARD_CHANGES') }}
      </div>
      <div>
        {{ $tc('COREWEBCLIENT.ERROR_PASS_INCORRECT') }}
      </div>
      <div>
        {{ $tc('COREWEBCLIENT.ERROR_PASS_INCORRECT') }}
      </div>
      <div>
        {{ $tc('COREWEBCLIENT.ERROR_PASS_INCORRECT') }}
      </div>
      <div>
        {{ $tc('COREWEBCLIENT.ERROR_PASS_INCORRECT') }}
      </div>
    </div>
  </main-layout>
</template>

<script>
import MainLayout from 'src/views/layouts/MainLayout'

export default {
  name: 'Settings',
  components: {
    MainLayout,
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
  },
}
</script>

<style scoped></style>
