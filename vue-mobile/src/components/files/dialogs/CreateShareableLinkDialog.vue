<template>
  <q-dialog v-model="openDialog">
    <q-card v-if="!file.publicLink" class="q-dialog-size q-pt-md q-px-sm" style="min-width: 350px">
      <div style="font-size: 15px" class="q-px-md text-bold text-black text">
        <span>{{ $t('OPENPGPFILESWEBCLIENT.HEADING_CREATE_PUBLIC_LINK') }}</span>
      </div>
      <q-checkbox v-model="withPassword" class="q-ma-sm" label="Protect public link with password" color="primary" />
      <q-card-actions align="right" >
        <button-dialog
          :saving="saving" :action="createShareableLink"
          label="Create shareable link"
        />
        <button-dialog
          :saving="saving" :action="cancelDialog"
          label="Cancel"
        />
      </q-card-actions>
    </q-card>
    <q-card v-if="file.publicLink" class="q-dialog-size q-pt-md q-px-sm" style="min-width: 350px">
      <div class="q-pa-sm">
        <div>
          <div>
            <span>{{ $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK') }}</span>
          </div>
          <div class="q-mt-xs">
            <q-icon class="q-mr-sm" size="sm" name="content_copy"/>
            <span>{{file.publicLink}}</span>
          </div>
        </div>
        <div v-if="file.linkPassword" class="q-mt-md">
          <div>
            <span>{{ $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK') }}</span>
          </div>
          <div>
            <q-icon class="q-mr-sm" size="sm" name="content_copy"/>
            <span>{{file.linkPassword}}</span>
          </div>
        </div>
      </div>
      <q-card-actions align="right" >
        <button-dialog
          :saving="saving" :action="createShareableLink"
          :label="$t('OPENPGPFILESWEBCLIENT.ACTION_SEND_EMAIL')"
        />
        <button-dialog
          :saving="saving" :action="removeLink"
          :label="$t('FILESWEBCLIENT.ACTION_REMOVE_PUBLIC_LINK')"
        />
        <button-dialog
          :saving="saving" :action="cancelDialog"
          :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import ButtonDialog from "components/files/common/ButtonDialog";
import { mapActions } from "vuex";

export default {
  name: "CreateShareableLinkDialog",
  components: { ButtonDialog },
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

