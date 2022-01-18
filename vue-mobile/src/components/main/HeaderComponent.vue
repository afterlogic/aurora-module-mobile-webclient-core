<template>
  <q-header elevated reveal class="bg-white" style="transform: none">
    <component :is="component" @openDrawer="$emit('openDrawer')" />
  </q-header>
</template>

<script>
import FilesHeader from 'components/files/header/FilesHeader'

export default {
  name: 'HeaderComponent',
  components: {
    FilesHeader,
  },
  computed: {
    component() {
      return 'FilesHeader'
    },
  },
}
</script>

<style scoped></style>
