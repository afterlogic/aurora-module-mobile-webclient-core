<template>
  <component
    :is="component"
    :file="currentFile"
    v-model="dialog"
    @closeDialog="closeDialog"
    @dialogAction="dialogAction"
  />
  <file-uploader />
</template>

<script>
import FileMenuDialog from 'components/files/dialogs/FileMenuDialog'
import RenameItemDialog from 'components/files/dialogs/RenameItemDialog'
import DeleteItemsDialog from 'components/files/dialogs/DeleteItemsDialog'
import CreateFolderDialog from 'components/files/dialogs/CreateFolderDialog'
import CreateButtonsDialogs from 'components/files/dialogs/CreateButtonsDialogs'
import CreateShareableLinkDialog from 'components/files/dialogs/CreateShareableLinkDialog'
import ShareWithTeammatesDialog from 'components/files/dialogs/ShareWithTeammatesDialog'
import FileUploader from 'components/files/dialogs/FileUploader'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DialogsList',
  components: {
    FileMenuDialog,
    RenameItemDialog,
    DeleteItemsDialog,
    CreateFolderDialog,
    CreateButtonsDialogs,
    CreateShareableLinkDialog,
    ShareWithTeammatesDialog,
    FileUploader,
  },
  data() {
    return {
      dialog: false,
      component: 'FileMenuDialog',
    }
  },
  computed: {
    ...mapGetters('files', ['dialogComponent', 'currentFile']),
  },
  watch: {
    dialogComponent(val) {
      if (val.component !== 'FileUploader') {
        if (!val.component) {
          this.dialog = false
        } else {
          this.component = val.component
          this.dialog = true
        }
      }
    },
    dialog(val) {
      if (!val && this.dialogComponent.component === 'CreateButtonsDialogs')
        this.changeDialogComponent({ component: '' })
    },
  },
  methods: {
    ...mapActions('files', ['changeDialogComponent']),
    dialogAction(action) {
      this.closeDialog()
      if (action.component) {
        this.changeDialogComponent({ component: action.component })
      } else if (action.method) {
        action.method(this.$store)
      }
    },
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>

<style scoped></style>
