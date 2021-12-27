<template>
  <component :is="component" :dialog="dialog" :file="file"/>
</template>

<script>
import FileMenuDialog from "components/files/dialogs/FileMenuDialog";
import RenameItemDialog from "components/files/dialogs/RenameItemDialog";
export default {
  name: "DialogsList",
  props: {
    component: { type: String, default: '' },
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false }
  },
  components: {
    FileMenuDialog,
    RenameItemDialog
  },
}
</script>

<style scoped>

</style>
