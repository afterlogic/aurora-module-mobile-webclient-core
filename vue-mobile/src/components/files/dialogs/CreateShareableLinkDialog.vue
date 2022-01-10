<template>
  <q-dialog v-model="openDialog">
    <q-card v-if="!file.publicLink" class="q-dialog-size q-pt-md q-px-sm" style="min-width: 350px">
      <div style="font-size: 15px" class="q-px-md text-bold text-black text">
        <span>Create shareable link</span>
      </div>
      <q-checkbox v-model="withPassword" class="q-ma-sm" label="Protect public link with password" color="primary" />
      <q-card-actions align="right" >
        <q-btn
          class="text-no-wrap"
          no-caps
          size="14px" flat color="primary"
          :disable="saving" @click="createShareableLink"
          label="Create shareable link"
        />
        <q-btn
          size="14px" flat color="primary"
          no-caps
          :disable="saving" @click="cancelDialog"
          label="Cancel"
        />
      </q-card-actions>
    </q-card>
    <q-card v-if="file.publicLink" class="q-dialog-size q-pt-md q-px-sm" style="min-width: 350px">
      <div class="q-pa-sm">
        <div>
          <div>
            <span>Public Link</span>
          </div>
          <div class="q-mt-xs">
            <q-icon class="q-mr-sm" size="sm" name="content_copy"/>
            <span>{{file.publicLink}}</span>
          </div>
        </div>
        <div v-if="file.linkPassword" class="q-mt-md">
          <div>
            <span>Public Link</span>
          </div>
          <div>
            <q-icon class="q-mr-sm" size="sm" name="content_copy"/>
            <span>{{file.linkPassword}}</span>
          </div>
        </div>
      </div>
      <q-card-actions align="right" >
        <q-btn
          class="text-no-wrap"
          no-caps
          size="14px" flat color="primary"
          :disable="saving" @click="createShareableLink"
          label="Send to..."
        />
        <q-btn
          size="14px" flat color="primary"
          no-caps
          :disable="saving" @click="removeLink"
          label="Remove link"
        />
        <q-btn
          size="14px" flat color="primary"
          no-caps
          :disable="saving" @click="cancelDialog"
          label="Close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CreateShareableLinkDialog",
  // components: { AppButton },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false }
  },
  data () {
    return {
      withPassword: false,
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
    ...mapActions('files', ['asyncCreateShareableLink', 'asyncDeletePublicLink']),
    async createShareableLink() {
      await this.asyncCreateShareableLink({ withPassword: this.withPassword })
    },
    async removeLink() {
      this.saving = true
      const result = await this.asyncDeletePublicLink()
      this.saving = false
      if (result) this.$emit('closeDialog')
    },
    cancelDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>

