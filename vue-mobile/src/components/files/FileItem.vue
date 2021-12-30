<template>
  <q-item v-if="file"
          :disable="file.isCopied"
          :clickable="!isCopied"
          v-ripple="!isSelected && !isCopied"
          :active="file.isSelected"
          @touchstart.stop="touchstart(file)"
          @touchend.stop="selectFile"
  >
    <q-item-section avatar>
      <file-icon color="primary" class="text-primary"></file-icon>
    </q-item-section>
    <q-item-section class="text-info">
      <q-item-label>{{ fileName }}</q-item-label>
      <q-item-label></q-item-label>
    </q-item-section>
    <q-item-section avatar side>
      <q-btn v-if="!file.isSelected" v-ripple="!isCopied && !isSelected" :disable="isSelected" size="14px" color="grey" flat round icon="more_vert"
             @touchstart.stop @touchend.stop="showDialog"/>
      <q-btn v-ripple="!isCopied" v-if="file.isSelected" size="14px" color="grey" flat round icon="done"/>
    </q-item-section>
  </q-item>
</template>

<script>
import FileIcon from "components/files/icons/FileIcon";
import { getShortName } from "src/utils/files/utils";

export default {
  name: "FileItem",
  components: {
    FileIcon
  },
  props: {
    file: {type: Object, default: null},
    isSelected: { type: Boolean, default: false },
    isCopied: { type: Boolean, default: false },
    touchstart: { type: Function, default: null, require: true },
    touchend: { type: Function, default: null, require: true },
  },
  computed: {
    fileName() {
      if (this.file) {
        return getShortName(this.file.name, 30)
      }
      return ''
    }
  },
  methods: {
    selectFile() {
      if (!this.isSelected) {
        this.touchend()
        this.$router.push({ path: `/file/${this.file.id}` })
      } else {
      }
    },
    showDialog() {
      if (!this.isSelected && !this.isCopied) {
        this.$emit('showDialog', { file: this.file, component: 'FileMenuDialog' })
      }
    }
  }
}
</script>

<style scoped>

</style>
