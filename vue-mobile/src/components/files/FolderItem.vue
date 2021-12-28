<template>
  <q-item
    v-if="folder"
    v-ripple="!isSelected"
    :active="folder.isSelected"
    clickable
    @touchstart="touchstart(folder)"
    @touchend="openFolder"
  >
    <q-item-section avatar>
      <file-icon></file-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ folderName }}</q-item-label>
      <q-item-label></q-item-label>
    </q-item-section>
    <q-item-section avatar side>
      <q-btn
        v-if="!folder.isSelected"
        size="14px"
        color="grey"
        :disable="isSelected"
        v-ripple="!isSelected"
        flat
        round
        icon="more_vert"
        @touchstart.stop
        @touchend.stop="showDialog"
      />
      <q-btn v-ripple="false" v-if="folder.isSelected" size="14px" color="grey" flat round icon="done" />
    </q-item-section>
  </q-item>
</template>

<script>
import FileIcon from "components/files/icons/FileIcon";
import { getShortName } from "src/utils/files/utils";

export default {
  name: "FolderItem",
  components: {
    FileIcon
  },
  props: {
    folder: {type: Object, default: null},
    isSelected: { type: Boolean, default: false },
    touchstart: { type: Function, default: null, require: true },
    touchend: { type: Function, default: null, require: true },
  },
  computed: {
    currentStorage() {
      return this.$store.getters['files/getCurrentStorage']
    },
    folderName() {
      if (this.folder) {
        return getShortName(this.folder.name, 30)
      }
      return ''
    }
  },
  methods: {
    async openFolder() {
      if (!this.isSelected) {
        this.touchend()
        const path = {
          path: this.folder.fullPath,
          name: this.folder.name
        }
        await this.$store.dispatch('files/changeCurrentPaths', { path, lastStorage: false })
        await this.$store.dispatch('files/asyncGetFiles', {
          path: this.folder.fullPath
        })
      } else {
      }
    },
    showDialog() {
      if (!this.isSelected) {
        this.$emit('showDialog', { file: this.folder, component: 'FileMenuDialog' })
      }
    }
  }
}
</script>

<style scoped>

</style>
