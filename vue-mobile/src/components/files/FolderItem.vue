<template>
  <q-item v-if="folder" clickable v-ripple @click.prevent="openFolder">
    <q-item-section avatar>
      <file-icon></file-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ getShortName(folder.Name, 30) }}</q-item-label>
      <q-item-label></q-item-label>
    </q-item-section>
    <q-item-section avatar side>
      <q-btn size="14px" color="grey" flat round icon="more_vert" @click.stop="$emit('showDialog', folder)"/>
    </q-item-section>
  </q-item>
</template>

<script>
import FileIcon from "components/files/icons/FileIcon";
import { getShortName } from "src/services/files/utils";

export default {
  name: "FolderItem",
  components: {
    FileIcon
  },
  props: {
    folder: {type: Object, default: null}
  },
  computed: {
    currentStorage() {
      return this.$store.getters['files/getCurrentStorage']
    },
  },
  methods: {
    getShortName,
    async openFolder() {
      const path = {
        path: this.folder.FullPath,
        name: this.folder.Name
      }
      await this.$store.dispatch('files/changeCurrentPaths', { path, lastStorage: false })
      await this.$store.dispatch('files/asyncGetFiles', {
        path: this.folder.FullPath
      })
    },
  }
}
</script>

<style scoped>

</style>
