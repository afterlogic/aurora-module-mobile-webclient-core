<template>
  <q-dialog v-model="openDialog">
    <q-card class="q-dialog-size q-px-sm">
      <q-card-section>
        <span>{{ title }}</span>
      </q-card-section>
      <div class="flex no-wrap">
        <AppButton size="18px" flat color="primary"
               label="Delete" @click="deleteItems"/>
        <AppButton size="18px" flat class="q-px-sm"  color="grey-6"
               label="Cancel" @click="closeDialog"/>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import AppButton from "components/common/AppButton";
import { mapActions, mapGetters } from "vuex";
export default {
  name: 'DeleteItemsDialog',
  components: {
    AppButton
  },
  props: {
    file: {
      type: Object,
      default: null,
    },
    dialog: { type: Boolean, default: false }
  },
  data () {
    return {
      openDialog: false
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    }
  },
  computed: {
    ...mapGetters('files', ['selectedFiles']),
    title () {
      if (this.selectedFiles.length > 1) {
        return 'Delete selected items permanently?'
      }
      if (this.file?.isFolder) {
        return 'Delete selected folder permanently?'
      }
      return 'Delete selected file permanently?'
    },
  },
  methods: {
    ...mapActions('files', ['deleteItems', 'changeItemsLists']),
    closeDialog() {
      this.$emit('closeDialog')
    },
    async deleteItems() {
      const items = []
      if (this.selectedFiles.length) {
        this.selectedFiles.forEach( file => {
          items.push({
            Path: file.path,
            Name: file.name,
            IsFolder: file.isFolder
          })
        } )
      } else {
        items.push({
          Path: this.file.path,
          Name: this.file.name,
          IsFolder: this.file.isFolder
        })
      }
      const result = await this.deleteItems({ items })
      if (result) {
        await this.changeItemsLists({
          items: this.selectedFiles.length ? this.selectedFiles : [this.file]
        })
        this.$emit('closeDialog')
      }
    }
  }
}
</script>

<style scoped>

</style>
