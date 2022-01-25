<template>
  <q-dialog v-bind="$attrs">
    <q-card class="q-dialog-size q-pt-md" style="min-width: 300px">
      <q-item>
        <app-dialog-input
          :placeholder="
            $t('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.LABEL_KEY_NAME')
          "
        />
      </q-item>
      <q-item>
        <app-dialog-input
          :placeholder="
            $t('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.LABEL_YOUR_KEY')
          "
          :autofocus="true"
        />
      </q-item>
      <q-card-actions align="right">
        <button-dialog
          :saving="saving"
          :action="importKey"
          :label="$t('COREWEBCLIENT.ACTION_SAVE')"
        />
        <button-dialog
          :saving="saving"
          v-close-popup
          :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import ButtonDialog from 'components/files/common/ButtonDialog'
import AppDialogInput from 'components/common/AppDialogInput'

export default {
  name: 'ImportKeyFromString',
  components: {
    ButtonDialog,
    AppDialogInput,
  },
  data: () => ({
    saving: false,
  }),
  methods: {
    importKey() {
      console.log('dsfs')
    },
  },
}
</script>

<style scoped></style>
