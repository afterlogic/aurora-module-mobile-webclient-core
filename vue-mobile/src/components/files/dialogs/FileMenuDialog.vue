<template>
  <q-dialog v-model="openDialog" position="bottom">
    <q-card v-if="file" style="height: 300px">
      <q-card-section class="row items-center no-wrap" style="height: 50px">
        <div>
          <div class="text-weight-bold">{{file.Name}}</div>
        </div>
      </q-card-section>
      <q-separator />
        <q-list style="height: 250px" class="scroll">
          <q-item class="q-my-sm" clickable v-for="fileAction in actions" :key="fileAction.name">
            <div class="flex full-width" @click="performAction(fileAction)">
              <div>
                <q-icon size="26px" name="file_copy" color="primary"></q-icon>
              </div>
              <div class="q-pl-sm text-subtitle1">
                {{fileAction.displayName}}
              </div>
            </div>
          </q-item>
        </q-list>
    </q-card>
  </q-dialog>
</template>

<script>
import { getFileActions } from "src/services/files/file-actions";

export default {
  name: "FileMenuDialog",
  props: {
    file: {
      type: Object,
      default: null,
    },
    dialog: { type: Boolean, default: false }
  },
  computed: {
    actions() {
      return getFileActions(this.file)
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    }
  },
  data () {
    return {
      openDialog: false
    }
  },
  methods: {
    performAction(fileAction) {
      this.$emit('dialogAction', fileAction)
    }
  }
}
</script>

<style scoped>

</style>
