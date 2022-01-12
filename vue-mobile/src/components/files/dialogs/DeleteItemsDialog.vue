<template>
  <q-dialog v-model="openDialog">
    <q-card class="q-dialog-size q-px-sm">
      <q-card-section>
        <span>{{ title }}</span>
      </q-card-section>
      <div class="flex no-wrap">
        <AppButton size="18px" flat color="primary"
               :label="$t('COREWEBCLIENT.ACTION_DELETE')" @click.stop="deleteItems"/>
        <AppButton size="18px" flat class="q-px-sm"  color="grey-6"
               :label="$t('COREWEBCLIENT.ACTION_CANCEL')" @click.stop="closeDialog"/>
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
        return this.$tc('FILESWEBCLIENT.CONFIRM_DELETE_ITEMS_PLURAL', this.selectedFiles.length)
      }
      if (this.file?.isFolder) {
        return this.$t('FILESWEBCLIENT.CONFIRM_DELETE_FOLDERS_PLURAL')
      }
      return this.$t('FILESWEBCLIENT.CONFIRM_DELETE_FILES_PLURAL')
    },
  },
  methods: {
    ...mapActions('files', ['asyncDeleteItems', 'changeItemsLists']),
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
      const result = await this.asyncDeleteItems({ items })
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
