<template>
  <q-dialog v-model="openDialog">
    <q-card class="q-dialog-size q-pt-md q-px-sm" style="min-width: 300px">
      <div style="font-size: 15px" class="q-px-md text-bold text-primary text">
        <span>Add new folder</span>
      </div>
      <q-item>
        <app-input
          placeholder="Enter folder name"
          outlined
          autofocus
          dense
          v-model="folderName"
          style="width: 250px"
          @keyup.enter="createFolder"
        />
      </q-item>
      <q-card-actions align="center">
        <app-button class="q-my-sm" :disable="saving" @click="createFolder" size="md" label="Confirm"></app-button>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import AppInput from "components/common/AppInput";
import AppButton from "components/common/AppButton";
import { mapActions } from "vuex";

export default {
  name: "CreateFolderDialog",
  components: { AppInput, AppButton },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false }
  },
  data () {
    return {
      folderName: '',
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
    ...mapActions('files', ['createFolder', 'asyncGetFiles']),
    async createFolder () {
      const result = await this.createFolder({ name: this.folderName })
      if (result) {
        this.$emit('closeDialog')
        await this.asyncGetFiles()
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
