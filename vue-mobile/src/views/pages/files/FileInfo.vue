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
        <input-form readonly :value="fileSize" label="Size"/>
        <input-form readonly :value="fileDate" label="Created"/>
      </div>
      <div class="q-ma-md">
        <input-form readonly :value="currentFile.path" label="Location"/>
      </div>
      <div class="q-ma-md">
        <input-form readonly :value="currentFile.owner" label="Owner"/>
      </div>
    </div>
  </div>
  <dialogs-list />
</main-layout>
</template>

<script>
import DialogsList from "components/files/DialogsList";
import MainLayout from "src/views/layouts/MainLayout";
import FileIcon from "components/files/icons/FileIcon";
import InputForm from "components/files/common/InputForm";
import { mapGetters } from "vuex";
import date from "src/utils/date";
import text from "src/utils/text";
export default {
  name: "FileInfo",
  components: {
    MainLayout,
    FileIcon,
    InputForm,
    DialogsList
  },
  computed: {
    ...mapGetters('files', ['currentFile']),
    fileDate() {
      return date.getDate(this.currentFile.lastModified)
    },
    fileSize() {
      return text.getFriendlySize(this.currentFile.size)
    },
  }
}
</script>

<style lang="scss" scoped>
.file__preview {
  margin-top: 60px;
  margin-bottom: 60px;
}
</style>
