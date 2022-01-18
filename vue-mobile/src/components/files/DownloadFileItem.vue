<template>
  <q-item v-if="isShowFile" clickable>
    <q-item-section avatar>
      <file-icon color="primary" class="text-primary"></file-icon>
    </q-item-section>
    <q-item-section class="text-info">
      <q-item-label>{{ file.name }}</q-item-label>
      <q-item-label>{{ progressPercent }}%</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import FileIcon from 'components/files/icons/FileIcon'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'DownloadFileItem',
  props: {
    file: { type: Object, default: null },
  },
  components: {
    FileIcon,
  },
  data() {
    return {
      progressPercent: 0,
    }
  },
  computed: {
    ...mapGetters('files', ['currentPath', 'currentStorage']),
    isShowFile() {
      if (!this.file) return false
      return (
        this.file.path === this.currentPath &&
        this.file.storage === this.currentStorage.Type &&
        this.file.isUploading
      )
    },
  },
  mounted() {
    this.getProgressPercent()
  },
  methods: {
    ...mapActions('files', ['changeUploadingStatus']),
    getProgressPercent() {
      if (this.file) {
        if (this.file.file?.__progress !== 1) {
          this.progressPercent = Math.ceil(this.file.file.__progress * 100) || 0
          setTimeout(() => {
            if (this.progressPercent !== 100) {
              this.getProgressPercent()
            }
          }, 100)
        } else {
          this.changeUploadingStatus({ file: this.file, status: false })
        }
      }
    },
  },
}
</script>

<style scoped></style>
