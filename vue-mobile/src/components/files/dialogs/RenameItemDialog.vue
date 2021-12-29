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
      <q-card-actions class="q-my-sm" align="center">
          <app-button :disable="saving" @click="renameItem" size="md" label="Confirm"></app-button>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import notification from "src/utils/notification";
import AppInput from "components/common/AppInput";
import AppButton from "components/common/AppButton";
import { mapActions } from "vuex";
export default {
  name: 'RenameItemDialog',
  components: { AppInput, AppButton },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false }
  },
  data () {
    return {
      itemName: this.file.name,
      openDialog: false,
      saving: false
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    }
  },
  methods: {
    ...mapActions('files', ['asyncRenameItem', 'changeFileName']),
    async renameItem () {
      if (this.itemName.length) {
        this.saving = true
        const result = await this.asyncRenameItem({
          file: this.file,
          itemName: this.itemName
        })
        if (result) {
          await this.changeFileName(this.itemName)
          this.openDialog = false
          this.saving = false
          this.$emit('closeDialog')
        }
      } else {
        notification.showError('Invalid folder name')
      }
    },
    cancelDialog () {
      this.openDialog = false
    }
  }
}
</script>

<style scoped>

</style>
