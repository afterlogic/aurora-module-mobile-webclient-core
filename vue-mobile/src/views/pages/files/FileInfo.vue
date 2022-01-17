<template>
<main-layout title="File info">
  <div class="file">
    <div class="flex items-center justify-center">
      <file-icon v-if="!currentFile.thumbnailUrl" class="file__preview" :width="64" :height="64"/>
      <div style="height: 184px" v-if="currentFile.thumbnailUrl">
        <div class="img-preview"
             :style="{'background': `url(${filePreview}) no-repeat center`, 'background-size': 'contain'}"/>
      </div>
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
import { getApiHost } from "src/api/helpers";

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
    filePreview() {
      const api = getApiHost()
      return  api + this.currentFile.viewUrl
    },
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
