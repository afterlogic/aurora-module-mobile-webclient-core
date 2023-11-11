<template>
  <q-uploader
    multiple
    style="max-height: initial; display: none"
    class="col full-height full-width"
    flat
    ref="uploader"
    :factory="addedFiles"
    @added="onFilesSelected"
    @uploaded="onFileUploaded"
    @finish="onFinishUpload"
  />
</template>

<script>
export default {
  name: 'UploaderComponent',
  data() {
    return {
      factory: null,
      added: null,
      uploaded: null,
      finish: null,
    }
  },
  methods: {
    open(methods) {
      if (methods) {
        this.factory = methods.factory
        this.added = methods.added
        this.uploaded = methods.uploaded
        this.finish = methods.finish
        this.$refs.uploader.removeQueuedFiles()
        this.$refs.uploader.removeUploadedFiles()
        this.$refs.uploader.pickFiles()
      }
    },
    upload(methods) {
      this.factory = methods.factory
      this.added = methods.added
      this.uploaded = methods.uploaded
      this.finish = methods.finish
      this.$refs.uploader.upload()
    },
    addedFiles() {
      return this.factory()
    },
    onFilesSelected(files) {
      this.added(files, this.$refs.uploader)
    },
    onFileUploaded(file) {
      this.uploaded(file)
    },
    onFinishUpload() {
      this.finish()
    },
  },
}
</script>
