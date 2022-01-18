<template>
  <main-layout title="Files">
    <template v-slot:drawer>
      <storage-item
        v-for="storage in storageList"
        :key="storage"
        :storage="storage"
      />
    </template>
    <q-list v-if="!loadingStatus">
      <folder-item
        v-for="file in foldersList"
        :key="file"
        :folder="file"
        :isSelected="isSelected"
        :isCopied="isCopied"
        :touchstart="touchstart"
        :touchend="touchend"
        @touchmove="touchend"
        @showDialog="showDialog"
      />
      <download-file-item
        v-for="file in downloadFiles"
        :key="file.name"
        :file="file"
      />
      <file-item
        v-for="file in filesList"
        :key="file"
        :file="file"
        :isSelected="isSelected"
        :isCopied="isCopied"
        :touchstart="touchstart"
        :touchend="touchend"
        @touchmove="touchend"
        @showDialog="showDialog"
      />
      <div style="height: 130px" class="full-width" />
    </q-list>
    <div class="q-mt-xl flex items-center justify-center" v-if="loadingStatus">
      <q-circular-progress
        indeterminate
        size="40px"
        color="primary"
        class="q-ma-md"
      />
    </div>
    <files-captions v-if="!loadingStatus" />
    <app-create-button
      icon="add"
      @click="showDialog({ file: null, component: 'CreateButtonsDialogs' })"
    />
    <dialogs-list />
  </main-layout>
</template>

<script>
import MainLayout from 'src/views/layouts/MainLayout'
import FileItem from 'components/files/FileItem'
import FolderItem from 'components/files/FolderItem'
import StorageItem from 'components/files/StorageItem'
import DialogsList from 'components/files/DialogsList'
import AppCreateButton from 'components/common/AppCreateButton'
import DownloadFileItem from 'components/files/DownloadFileItem'
import FilesCaptions from 'components/files/FilesCaptions'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Files',
  components: {
    MainLayout,
    FolderItem,
    FileItem,
    StorageItem,
    DialogsList,
    AppCreateButton,
    DownloadFileItem,
    FilesCaptions,
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
    ...mapGetters('files', [
      'filesList',
      'foldersList',
      'storageList',
      'selectedFiles',
      'copiedFiles',
      'downloadFiles',
      'currentFile',
      'isArchive',
      'loadingStatus',
    ]),
    isCopied() {
      return !!this.copiedFiles.length
    },
  },
  watch: {
    selectedFiles(items) {
      if (!items.length) {
        setTimeout(() => {
          this.isSelected = false
        }, 300)
      }
    },
  },
  methods: {
    ...mapActions('files', [
      'asyncGetStorages',
      'asyncGetFiles',
      'selectFile',
      'changeDialogComponent',
      'changeSelectStatus',
      'changeLoadingStatus',
    ]),
    async init() {
      if (!this.copiedFiles.length) {
        if (!this.currentFile) {
          this.changeLoadingStatus(true)
          await this.asyncGetStorages()
        }
        await this.asyncGetFiles()
        this.changeLoadingStatus(false)
      }
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
      if (!file.downloading) {
        this.selectFile(file)
        if (!this.isArchive) {
          if (!this.isSelected && !this.isCopied) {
            this.touchTimer = setTimeout(this.selectItem, 1000)
          } else if (!this.isCopied) {
            this.changeSelectStatus()
          }
        }
      }
    },
    touchend() {
      if (this.touchTimer) clearTimeout(this.touchTimer)
    },
  },
}
</script>

<style scoped></style>
