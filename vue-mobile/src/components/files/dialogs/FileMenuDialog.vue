<template>
  <q-dialog v-model="openDialog" position="bottom">
    <q-card v-if="file" style="height: 300px">
      <q-card-section class="row items-center no-wrap" style="height: 50px">
        <div>
          <div class="text-weight-bold">{{file.name}}</div>
        </div>
      </q-card-section>
      <q-separator />
        <q-list style="height: 250px" class="scroll">
          <div v-for="fileAction in actions" :key="fileAction.name">
            <q-item v-if="fileAction.isShowAction(fileAction.name, file)" class="q-my-sm" clickable>
              <div class="flex full-width" @click="performAction(fileAction)">
                <div>
                  <q-icon size="26px" :name="fileAction.icon" color="primary"></q-icon>
                </div>
                <div class="q-pl-md text-subtitle1">
                  {{fileAction.displayName}}
                </div>
              </div>
            </q-item>
          </div>
        </q-list>
    </q-card>
  </q-dialog>
</template>

<script>
import { getFileActionsList } from "src/utils/files/file-actions";

export default {
  name: "FileMenuDialog",
  props: {
    dialog: { type: Boolean, default: false },
    file: { type: Object, default: null }
  },
  computed: {
    actions() {
      return getFileActionsList(this.file)
    },
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  data () {
    return {
      openDialog: false
    }
  },
  methods: {
    performAction(fileAction) {
      this.$emit('dialogAction', fileAction)
    },
  }
}
</script>

<style scoped>

</style>
