<template>
   <q-dialog v-model="openDialog">
     <div
       class="flex column q-pa-sm absolute"
       style="box-shadow: none; position: fixed; z-index: 1; bottom: 19%; right: 4%; margin-right: 2px;"
     >
       <q-btn class="q-mb-md" round color="primary" icon="create_new_folder" @click="createFolder" />
       <q-btn round color="primary" icon="note_add" @click="uploadFile" />
     </div>
   </q-dialog>
</template>

<script>
import {mapActions} from "vuex";
export default {
  name: "CreateButtonsDialogs",
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false }
  },
  data() {
    return {
      openDialog: false
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    }
  },
  methods: {
    ...mapActions('files', ['changeDialogComponent']),
    createFolder() {
      this.$emit('closeDialog')
      this.changeDialogComponent({ component: 'CreateFolderDialog' })
    },
    uploadFile() {
      console.log('click')
    },
  }
}
</script>

<style scoped>

</style>
