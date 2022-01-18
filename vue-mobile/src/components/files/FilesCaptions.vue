<template>
  <div class="q-mt-xl flex items-center justify-center text-h6 text-grey-6">
    <div v-if="isFolderEmpty">Folder is empty</div>
    <div v-if="isNothingFound">Nothing found</div>
    <div v-if="isNoSharedFiles">No shared files</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FilesCaptions',
  computed: {
    ...mapGetters('files', [
      'downloadFiles',
      'filesList',
      'foldersList',
      'searchText',
      'currentStorage',
      'currentPath',
      'loadingStatus',
    ]),
    isFolder() {
      return !!this.currentPath
    },
    isFolderEmpty() {
      return (
        !this.loadingStatus &&
        !this.filesList.length &&
        !this.foldersList.length &&
        !this.searchText &&
        this.currentStorage.Type !== 'shared' &&
        this.isFolder &&
        !this.downloadFiles.length
      )
    },
    isNothingFound() {
      return (
        !this.loadingStatus &&
        !this.filesList.length &&
        !this.foldersList.length &&
        this.searchText &&
        !this.downloadFiles.length
      )
    },
    isNoSharedFiles() {
      return (
        !this.filesList.length &&
        !this.foldersList.length &&
        this.currentStorage.Type === 'shared' &&
        !this.searchText &&
        !this.loadingStatus &&
        !this.downloadFiles.length
      )
    },
  },
}
</script>

<style scoped></style>
