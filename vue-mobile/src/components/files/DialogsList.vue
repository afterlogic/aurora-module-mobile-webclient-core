<template>
  <component :is="component" :dialog="dialog" :file="file"/>
</template>

<script>
import FileMenuDialog from "components/files/dialogs/FileMenuDialog";
export default {
  name: "DialogsList",
  props: {
    component: { type: String, default: '' },
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false }
  },
  components: {
    FileMenuDialog
  },
}
</script>

<style scoped>

</style>
