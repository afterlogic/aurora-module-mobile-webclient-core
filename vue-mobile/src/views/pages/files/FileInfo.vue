<template>
<main-layout title="File info">
  <div class="file">
    <div class="flex items-center justify-center">
      <file-icon class="file__preview" :width="64" :height="64"/>
    </div>
    <div>
      <div class="q-mx-md">
        <input-form readonly :value="currentFile.name" label="File name"/>
      </div>
      <div class="flex justify-between q-ma-md">
        <input-form readonly :value="currentFile.size" label="Size"/>
        <input-form readonly :value="currentFile.lastModified" label="Created"/>
      </div>
      <div class="q-ma-md">
        <input-form readonly :value="currentFile.path" label="Location"/>
      </div>
      <div class="q-ma-md">
        <input-form readonly :value="currentFile.owner" label="Owner"/>
      </div>
    </div>
  </div>
</main-layout>
</template>

<script>
import MainLayout from "src/views/layouts/MainLayout";
import FileIcon from "components/files/icons/FileIcon";
import InputForm from "components/files/common/InputForm";
import { mapGetters } from "vuex";
export default {
  name: "FileInfo",
  components: {
    MainLayout,
    FileIcon,
    InputForm
  },
  computed: {
    ...mapGetters('files', ['currentFile'])
  }
}
</script>

<style lang="scss" scoped>
.file__preview {
  margin-top: 60px;
  margin-bottom: 60px;
}
</style>
