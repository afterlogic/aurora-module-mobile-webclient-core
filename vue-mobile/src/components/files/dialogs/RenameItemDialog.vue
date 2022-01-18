<template>
  <q-dialog v-model="openDialog" @escape-key="cancelDialog">
    <q-card class="q-dialog-size q-pt-md q-px-sm" style="min-width: 300px">
      <q-item>
        <app-input
          placeholder="File name"
          outlined
          autofocus
          dense
          v-model="itemName"
          style="width: 250px"
          @keyup.enter="renameItem"
        />
      </q-item>
      <q-card-actions align="right">
        <button-dialog
          :saving="saving"
          :action="renameItem"
          :label="$t('COREWEBCLIENT.ACTION_SAVE')"
        />
        <button-dialog
          :saving="saving"
          :action="cancelDialog"
          :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import AppInput from 'components/common/AppInput'
import ButtonDialog from 'components/files/common/ButtonDialog'
import { mapActions } from 'vuex'
export default {
  name: 'RenameItemDialog',
  components: { AppInput, ButtonDialog },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  data() {
    return {
      itemName: this.file.name,
      openDialog: false,
      saving: false,
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  methods: {
    ...mapActions('files', ['asyncRenameItem', 'changeFileName']),
    async renameItem() {
      if (this.itemName.length) {
        this.saving = true
        const result = await this.asyncRenameItem({
          file: this.file,
          itemName: this.itemName,
        })
        if (result) {
          await this.changeFileName(this.itemName)
          this.openDialog = false
          this.saving = false
          this.$emit('closeDialog')
        }
      }
    },
    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style scoped></style>
