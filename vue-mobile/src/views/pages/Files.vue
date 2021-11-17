<template>
  <main-layout title="Files">
    <template v-slot:drawer>
      <h1>Here might be a page title</h1>
    </template>
    <q-list>
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
      <file-item />
    </q-list>
  </main-layout>
</template>

<script>
import MainLayout from "src/views/layouts/MainLayout";
import FileItem from "components/files/FileItem";

export default {
  name: "Files",
  components: {
    MainLayout,
    FileItem,
  }
}
</script>

<style scoped>

</style>
