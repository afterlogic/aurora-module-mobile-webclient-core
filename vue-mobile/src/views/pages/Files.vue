<template>
  <main-layout title="Files">
    <template v-slot:drawer>
      <storage-item v-for="storage in storageList" :key="storage" :storage="storage" />
    </template>
    <q-list>
      <folder-item v-for="file in folderList" :key="file" :folder="file" @showDialog="showDialog"/>
      <file-item v-for="file in filesList" :key="file" :file="file" @showDialog="showDialog"/>
    </q-list>
    <dialogs-list v-model="dialog" :file="currentFile" :component="dialogComponent" @dialogAction="dialogAction"/>
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
      dialog: false,
      currentFile: null,
      dialogComponent: ''
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
    }
  },
  methods: {
    async init() {
      await this.$store.dispatch('files/asyncGetStorages')
      await this.$store.dispatch('files/asyncGetFiles', { path: '' })
    },
    showDialog(file) {
      this.dialog = true
      this.dialogComponent = 'FileMenuDialog'
      this.currentFile = file
    },
    dialogAction(action) {
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
