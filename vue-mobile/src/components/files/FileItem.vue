<template>
  <q-item v-if="file" clickable v-ripple @click.prevent="test(1)">
    <q-item-section avatar>
      <file-icon></file-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ file.Name }}</q-item-label>
      <q-item-label></q-item-label>
    </q-item-section>
    <q-item-section avatar side>
      <q-btn size="14px" color="grey" flat round icon="more_vert" @click.stop="test2(2)"/>
    </q-item-section>
  </q-item>
</template>

<script>
import FileIcon from "components/files/icons/FileIcon";

export default {
  name: "FileItem",
  components: {
    FileIcon
  },
  props: {
    file: {type: Object, default: null}
  },
  methods: {
    test(a) {
      console.log(a)
    },
    test2(a) {
      console.log(a)
    }
  }
}
</script>

<style scoped>

</style>
