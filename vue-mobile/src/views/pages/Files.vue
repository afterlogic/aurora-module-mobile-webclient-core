<template>
  <main-layout title="Files">
    <template v-slot:drawer>
      <storage-item v-for="storage in storageList" :key="storage" :storage="storage"></storage-item>
    </template>
    <q-list>
      <file-item v-for="file in filesList" :key="file" :file="file" />
    </q-list>
  </main-layout>
</template>

<script>
import MainLayout from "src/views/layouts/MainLayout";
import FileItem from "components/files/FileItem";
import StorageItem from "components/files/StorageItem";

export default {
  name: "Files",
  components: {
    MainLayout,
    FileItem,
    StorageItem
  },
  async mounted() {
    await this.init()
  },
  computed: {
    filesList() {
      return this.$store.getters['files/getFilesList']
    },
    storageList() {
      return this.$store.getters['files/getStorageList']
    }
  },
  methods: {
    async init() {
      await this.$store.dispatch('files/asyncGetStorages')
      await this.$store.dispatch('files/asyncGetFiles')
    }
  }
}
</script>

<style scoped>

</style>
