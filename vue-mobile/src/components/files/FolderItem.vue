<template>
  <q-item
    v-if="folder"
    :disable="folder.isCopied"
    v-ripple="!isSelected && !folder.isCopied"
    :active="folder.isSelected"
    clickable
    @touchstart="touchstart(folder)"
    @touchend="openFolder"
  >
    <q-item-section avatar>
      <folder-icon color="primary"></folder-icon>
    </q-item-section>
    <q-item-section class="text-info">
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
import FolderIcon from "components/files/icons/FolderIcon";
import { getShortName } from "src/utils/files/utils";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FolderItem",
  components: {
    FolderIcon
  },
  props: {
    folder: {type: Object, default: null},
    isSelected: { type: Boolean, default: false },
    isCopied: { type: Boolean, default: false },
    touchstart: { type: Function, default: null, require: true },
    touchend: { type: Function, default: null, require: true },
  },
  computed: {
    ...mapGetters('files', ['currentStorage']),
    folderName() {
      if (this.folder) {
        return getShortName(this.folder.name, 30)
      }
      return ''
    }
  },
  methods: {
    ...mapActions('files', ['changeCurrentPaths', 'asyncGetFiles']),
    async openFolder() {
      if (!this.isSelected && !this.folder.isCopied) {
        this.touchend()
        const path = {
          path: this.folder.fullPath,
          name: this.folder.name
        }
        await this.changeCurrentPaths({ path, lastStorage: false })
        await this.asyncGetFiles()
      } else {
      }
    },
    showDialog() {
      if (!this.isSelected && !this.isCopied) {
        this.$emit('showDialog', { file: this.folder, component: 'FileMenuDialog' })
      }
    }
  }
}
</script>

<style scoped>

</style>
