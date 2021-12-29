<template>
  <main-layout title="Files">
    <template v-slot:drawer>
      <storage-item v-for="storage in storageList" :key="storage" :storage="storage" />
    </template>
    <q-list>
      <folder-item
        v-for="file in foldersList"
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
import { mapGetters, mapActions } from 'vuex'
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
      touchTimer: null,
      isSelected: false,
    }
  },
  computed: {
    ...mapGetters('files',
      ['filesList', 'foldersList', 'storageList', 'selectedFiles', 'copiedFiles']
    ),
    isCopied() {
      return !!this.copiedFiles.length
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
    ...mapActions('files',
      ['asyncGetStorages', 'asyncGetFiles', 'selectFile', 'changeDialogComponent', 'changeSelectStatus']
    ),
    async init() {
      await this.asyncGetStorages()
      await this.asyncGetFiles()
    },
    showDialog({ file, component }) {
      this.selectFile(file)
      this.changeDialogComponent({ component })
    },
    selectItem() {
      this.isSelected = true
      this.changeSelectStatus()
    },
    touchstart(file) {
      this.selectFile(file)
      if (!this.isSelected && !this.isCopied) {
        this.touchTimer = setTimeout(this.selectItem, 1000);
      } else if (!this.isCopied) {
        this.changeSelectStatus()
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
