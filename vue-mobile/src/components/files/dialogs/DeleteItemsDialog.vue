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
    title () {
      // if (this.items.length > 1) {
      //   return 'Delete selected items permanently?'
      // }
      // if (this.currentFile?.IsFolder) {
      //   return 'Delete selected folder permanently?'
      // }
      return 'Delete selected file permanently?'
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    async deleteItems() {
      const items = [{
        Path: this.file.path,
        Name: this.file.name,
        IsFolder: this.file.isFolder
      }]
      const result = await this.$store.dispatch('files/deleteItems', { items })
      if (result) {
        await this.$store.dispatch('files/changeItemsLists', { items: [this.file] })
        this.$emit('closeDialog')
      }
    }
  }
}
</script>

<style scoped>

</style>
