<template>
  <div>
    <default-header v-if="isDefaultHeader" @openDrawer="$emit('openDrawer')"/>
    <select-header v-if="isSelectHeader" :items="selectedFiles"/>
    <copy-move-header v-if="isCopyMoveHeader"/>
    <file-info-header v-if="isInfoHeader"/>
  </div>
</template>

<script>
import DefaultHeader from "components/files/header/DefaultHeader";
import SelectHeader from "components/files/header/SelectHeader";
import CopyMoveHeader from "components/files/header/CopyMoveHeader";
import FileInfoHeader from "components/files/header/FileInfoHeader";
import { mapGetters } from "vuex";
export default {
  name: "FilesHeader",
  components: {
    DefaultHeader,
    SelectHeader,
    CopyMoveHeader,
    FileInfoHeader
  },
  computed: {
    ...mapGetters('files', ['selectedFiles', 'copiedFiles']),
    isInfoHeader() {
      const paths = this.$route.fullPath.split('/')
      let result = false
      paths.forEach( path => {
        if(path === 'file') result = true
      })
      return result
    },
    isDefaultHeader() {
      return !this.selectedFiles.length && !this.copiedFiles.length && !this.isInfoHeader
    },
    isSelectHeader() {
      return this.selectedFiles.length && !this.copiedFiles.length && !this.isInfoHeader
    },
    isCopyMoveHeader() {
      return this.copiedFiles.length && !this.isInfoHeader
    }
  },
}
</script>

<style scoped>

</style>
