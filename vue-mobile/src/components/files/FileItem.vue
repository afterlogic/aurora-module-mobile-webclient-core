<template>
  <q-item
    v-if="file"
    :disable="file.isCopied"
    :clickable="!isCopied"
    v-ripple="!isSelected && !isCopied"
    :active="file.isSelected"
    @touchstart.stop="touchstart(file)"
    @touchmove.stop="touchMove"
    @touchend.stop="selectFile"
  >
    <q-item-section avatar>
      <file-icon color="primary" class="text-primary"></file-icon>
    </q-item-section>
    <q-item-section class="text-info">
      <q-item-label class="text-subtitle1">{{ fileName }}</q-item-label>
      <q-item-label v-if="!file.downloading">
        <div class="flex">
          <div class="q-mr-xs" v-if="isShared">
            <q-icon style="margin-bottom: 2px" size="11px" name="share" />
          </div>
          <div class="q-mr-xs" v-if="file.publicLink">
            <q-icon style="margin-bottom: 2px" name="link" />
          </div>
          <div>{{ fileSize }}</div>
          <div class="q-mx-xs">|</div>
          <div>{{ fileDate }}</div>
        </div>
      </q-item-label>
      <q-item-label v-if="file.downloading">
        <downloading-progress :file="file" />
      </q-item-label>
    </q-item-section>
    <q-item-section avatar side>
      <q-btn
        v-if="!file.isSelected"
        v-ripple="!isCopied && !isSelected"
        :disable="isSelected"
        size="14px"
        color="grey"
        flat
        round
        icon="more_vert"
        @touchstart.stop
        @touchend.stop="showDialog"
      />
      <q-btn
        v-ripple="!isCopied"
        v-if="file.isSelected"
        size="14px"
        color="grey"
        flat
        round
        icon="done"
      />
    </q-item-section>
  </q-item>
</template>

<script>
import FileIcon from 'components/files/icons/FileIcon'
import DownloadingProgress from 'components/files/common/DownloadingProgress'
import { getShortName } from 'src/utils/files/utils'
import text from 'src/utils/text'
import date from 'src/utils/date'
import { mapGetters } from 'vuex'

export default {
  name: 'FileItem',
  components: {
    FileIcon,
    DownloadingProgress,
  },
  props: {
    file: { type: Object, default: null },
    isSelected: { type: Boolean, default: false },
    isCopied: { type: Boolean, default: false },
    touchstart: { type: Function, default: null, require: true },
    touchend: { type: Function, default: null, require: true },
  },
  data() {
    return {
      isMoved: false,
    }
  },
  computed: {
    ...mapGetters('files', ['copiedFiles']),
    fileName() {
      if (this.file) {
        return getShortName(this.file.name, 30)
      }
      return ''
    },
    fileSize() {
      return text.getFriendlySize(this.file.size)
    },
    fileDate() {
      return date.getDate(this.file.lastModified)
    },
    isShared() {
      return !!this.file.shares.length
    },
  },
  methods: {
    selectFile() {
      if (
        !this.isSelected &&
        !this.isMoved &&
        !this.file.downloading &&
        !this.copiedFiles.length
      ) {
        this.touchend()
        this.$router.push({ path: `/file/${this.file.id}` })
      } else {
        this.isMoved = false
      }
    },
    touchMove() {
      this.isMoved = true
      this.$emit('touchmove')
    },
    showDialog() {
      if (!this.isSelected && !this.isCopied) {
        this.$emit('showDialog', {
          file: this.file,
          component: 'FileMenuDialog',
        })
      }
    },
  },
}
</script>

<style scoped></style>
