<template>
  <div>
    <default-header v-if="!selectedFiles.length" @openDrawer="$emit('openDrawer')"/>
    <select-header v-if="selectedFiles.length" :items="selectedFiles"/>
  </div>
</template>

<script>
import DefaultHeader from "components/files/header/DefaultHeader";
import SelectHeader from "components/files/header/SelectHeader";
export default {
  name: "FilesHeader",
  components: {
    DefaultHeader,
    SelectHeader
  },
  computed: {
    selectedFiles() {
      return this.$store.getters['files/getSelectedFiles']
    }
  }
}
</script>

<style scoped>

</style>
