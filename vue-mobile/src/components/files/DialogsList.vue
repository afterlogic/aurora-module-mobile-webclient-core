<template>
  <component
    :is="component"
    :file="currentFile"
    v-model="dialog"
    @closeDialog="closeDialog"
    @dialogAction="dialogAction"
  />
</template>

<script>
import FileMenuDialog from "components/files/dialogs/FileMenuDialog";
import RenameItemDialog from "components/files/dialogs/RenameItemDialog";
import DeleteItemsDialog from "components/files/dialogs/DeleteItemsDialog";
import CreateFolderDialog from "components/files/dialogs/CreateFolderDialog";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DialogsList",
  components: {
    FileMenuDialog,
    RenameItemDialog,
    DeleteItemsDialog,
    CreateFolderDialog
  },
  data() {
    return {
      dialog: false,
      component: 'FileMenuDialog'
    }
  },
  computed: {
    ...mapGetters('files', ['dialogComponent', 'currentFile']),
  },
  watch: {
    dialogComponent(val) {
      console.log(val, 'val')
      this.component = val.component
      this.dialog = true
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
  }
}
</script>

<style scoped>

</style>
