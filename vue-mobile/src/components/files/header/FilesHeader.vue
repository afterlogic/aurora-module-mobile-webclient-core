<template>
  <div>
    <default-header v-if="!selectedFiles.length && !copiedFiles.length" @openDrawer="$emit('openDrawer')"/>
    <select-header v-if="selectedFiles.length && !copiedFiles.length" :items="selectedFiles"/>
    <copy-move-header v-if="copiedFiles.length"/>
  </div>
</template>

<script>
import DefaultHeader from "components/files/header/DefaultHeader";
import SelectHeader from "components/files/header/SelectHeader";
import CopyMoveHeader from "components/files/header/CopyMoveHeader";
import { mapGetters } from "vuex";
export default {
  name: "FilesHeader",
  components: {
    DefaultHeader,
    SelectHeader,
    CopyMoveHeader
  },
  computed: {
    ...mapGetters('files', ['selectedFiles', 'copiedFiles']),
  },
}
</script>

<style scoped>

</style>
