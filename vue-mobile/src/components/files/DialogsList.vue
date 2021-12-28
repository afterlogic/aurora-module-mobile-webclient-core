<template>
  <component :is="component" :dialog="dialog" :file="file"/>
</template>

<script>
import FileMenuDialog from "components/files/dialogs/FileMenuDialog";
import RenameItemDialog from "components/files/dialogs/RenameItemDialog";
import DeleteItemsDialog from "components/files/dialogs/DeleteItemsDialog";
export default {
  name: "DialogsList",
  props: {
    component: { type: String, default: '' },
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false }
  },
  components: {
    FileMenuDialog,
    RenameItemDialog,
    DeleteItemsDialog
  },
}
</script>

<style scoped>

</style>
