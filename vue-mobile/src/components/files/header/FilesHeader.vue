<template>
  <div>
    <default-header v-if="!selectedItems.length && !copiedItems.length" @openDrawer="$emit('openDrawer')"/>
    <select-header v-if="selectedItems.length && !copiedItems.length" :items="selectedItems"/>
    <copy-move-header v-if="copiedItems.length"/>
  </div>
</template>

<script>
import DefaultHeader from "components/files/header/DefaultHeader";
import SelectHeader from "components/files/header/SelectHeader";
import CopyMoveHeader from "components/files/header/CopyMoveHeader";
export default {
  name: "FilesHeader",
  components: {
    DefaultHeader,
    SelectHeader,
    CopyMoveHeader
  },
  computed: {
    selectedItems() {
      return this.$store.getters['files/getSelectedFiles']
    },
    copiedItems() {
      return this.$store.getters['files/getCopiedFiles']
    }
  },
}
</script>

<style scoped>

</style>
