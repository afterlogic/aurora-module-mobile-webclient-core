<template>
  <q-item v-if="file" clickable v-ripple @click="selectFile">
    <q-item-section avatar>
      <file-icon></file-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ fileName }}</q-item-label>
      <q-item-label></q-item-label>
    </q-item-section>
    <q-item-section avatar side>
      <q-btn size="14px" color="grey" flat round icon="more_vert"
             @click.stop="$emit('showDialog', { file, component: 'FileMenuDialog' })"/>
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
    file: {type: Object, default: null}
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
      console.log(this.file, 'this.file')
    }
  }
}
</script>

<style scoped>

</style>
