<template>
  <main-layout title="Files">
    <template v-slot:drawer>
      <storage-item v-for="storage in storageList" :key="storage" :storage="storage" />
    </template>
    <q-list>
      <folder-item
        v-for="file in folderList"
        :key="file"
        :folder="file"
        :isSelected="isSelected"
        :isCopied="isCopied"
        :touchstart="touchstart"
        :touchend="touchend"
        @showDialog="showDialog"
      />
      <file-item
        v-for="file in filesList"
        :key="file"
        :file="file"
        :isSelected="isSelected"
        :isCopied="isCopied"
        :touchstart="touchstart"
        :touchend="touchend"
        @showDialog="showDialog"
      />
    </q-list>
    <dialogs-list />
  </main-layout>
</template>

<script>
import MainLayout from "src/views/layouts/MainLayout";
import FileItem from "components/files/FileItem";
import FolderItem from "components/files/FolderItem";
import StorageItem from "components/files/StorageItem";
import DialogsList from "components/files/DialogsList";

export default {
  name: "Files",
  components: {
    MainLayout,
    FolderItem,
    FileItem,
    StorageItem,
    DialogsList
  },
  async mounted() {
    await this.init()
  },
  data() {
    return {
      // dialog: false,
      // currentFile: null,
      // dialogComponent: '',
      touchTimer: null,
      isSelected: false,
    }
  },
  computed: {
    filesList() {
      return this.$store.getters['files/getFilesList']
    },
    folderList() {
     return this.$store.getters['files/getFoldersList']
    },
    storageList() {
      return this.$store.getters['files/getStorageList']
    },
    selectedFiles() {
      return this.$store.getters['files/getSelectedFiles']
    },
    isCopied() {
      const copiedItems = this.$store.getters['files/getCopiedFiles']
      return !!copiedItems.length
    }
  },
  watch: {
    selectedFiles(items) {
      if (!items.length) {
        setTimeout(() => {
          this.isSelected = false
        }, 300)
      }
    }
  },
  methods: {
    async init() {
      await this.$store.dispatch('files/asyncGetStorages')
      await this.$store.dispatch('files/asyncGetFiles')
    },
    showDialog({ file, component }) {
      // this.dialog = true
      // this.dialogComponent = component
      // this.currentFile = file
      this.$store.dispatch('files/selectFile', file)
      this.$store.dispatch('files/changeDialogComponent', { component })
    },
    // closeDialog() {
    //   this.dialog = false
    // },
    // dialogAction(action) {
    //   this.closeDialog()
    //   if (action.component) {
    //     this.dialogComponent = action.component
    //     this.dialog = true
    //   }
    // },
    selectItem() {
      this.isSelected = true
      this.$store.dispatch('files/changeSelectStatus')
    },
    touchstart(file) {
      this.$store.dispatch('files/selectFile', file)
      if (!this.isSelected && !this.isCopied) {
        this.touchTimer = setTimeout(this.selectItem, 1000);
      } else if (!this.isCopied) {
        this.$store.dispatch('files/changeSelectStatus')
      }
    },
    touchend() {
      if (this.touchTimer)
        clearTimeout(this.touchTimer);
    }
  }
}
</script>

<style scoped>

</style>
