<template>
  <q-header elevated reveal class="bg-white" style="transform: none">
    <component :is="component" @openDrawer="$emit('openDrawer')" />
  </q-header>
</template>

<script>
import FilesHeader from 'components/files/header/FilesHeader'
import SettingsHeader from 'components/settings/header/SettingsHeader'

export default {
  name: 'HeaderComponent',
  components: {
    FilesHeader,
    SettingsHeader,
  },
  computed: {
    component() {
      const display = this.$route.fullPath.split('/')[1]
      switch (display) {
        case 'files':
          return 'FilesHeader'
        case 'file':
          return 'FilesHeader'
        case 'mail':
          return 'MailHeader'
        case 'settings':
          return 'SettingsHeader'
      }
      return ''
    },
  },
}
</script>

<style scoped></style>
