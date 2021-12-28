<template>
  <component
    :is="component"
    :file="file"
    v-model="dialog"
    @closeDialog="closeDialog"
    @dialogAction="dialogAction"
  />
</template>

<script>
import FileMenuDialog from "components/files/dialogs/FileMenuDialog";
import RenameItemDialog from "components/files/dialogs/RenameItemDialog";
import DeleteItemsDialog from "components/files/dialogs/DeleteItemsDialog";
export default {
  name: "DialogsList",
  components: {
    FileMenuDialog,
    RenameItemDialog,
    DeleteItemsDialog
  },
  data() {
    return {
      dialog: false,
      component: 'FileMenuDialog'
    }
  },
  computed: {
    dialogComponent() {
      return this.$store.getters['files/getDialogComponent']
    },
    file() {
      return this.$store.getters['files/getCurrentFile']
    }
  },
  watch: {
    dialogComponent(val) {
      this.component = val.component
      this.dialog = true
    },
  },
  methods: {
    dialogAction(action) {
      this.closeDialog()
      if (action.component) {
        this.$store.dispatch('files/changeDialogComponent', { component: action.component })
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
