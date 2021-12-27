<template>
  <q-item v-if="file" clickable v-ripple>
    <q-item-section avatar>
      <file-icon></file-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ getShortName(file.Name, 30) }}</q-item-label>
      <q-item-label></q-item-label>
    </q-item-section>
    <q-item-section avatar side>
      <q-btn size="14px" color="grey" flat round icon="more_vert" @click.stop="$emit('showDialog', file)"/>
    </q-item-section>
  </q-item>
</template>

<script>
import FileIcon from "components/files/icons/FileIcon";
import { getShortName } from "src/services/files/utils";

export default {
  name: "FileItem",
  components: {
    FileIcon
  },
  props: {
    file: {type: Object, default: null}
  },
  methods: {
    getShortName,
  }
}
</script>

<style scoped>

</style>
