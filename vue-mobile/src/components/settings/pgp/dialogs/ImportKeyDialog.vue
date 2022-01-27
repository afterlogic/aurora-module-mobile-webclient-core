<template>
  <q-dialog v-bind="$attrs">
    <q-card class="q-dialog-size q-pt-md" style="min-width: 300px">
      <q-item>
        <app-dialog-input
          v-model="keysArmorToImport"
          type="textarea"
          :placeholder="$t('OPENPGPWEBCLIENT.HEADING_IMPORT_KEY')"
          :autofocus="true"
        />
      </q-item>
      <q-card-actions align="right">
        <button-dialog
          :saving="saving"
          :action="check"
          :label="$t('OPENPGPWEBCLIENT.ACTION_CHECK')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import AppDialogInput from 'components/common/AppDialogInput'
import ButtonDialog from 'components/files/common/ButtonDialog'
import { checkPgpKeys } from 'src/utils/openPGP/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'ImportKeyDialog',
  components: {
    AppDialogInput,
    ButtonDialog,
  },
  data: () => ({
    saving: false,
    keysArmorToImport: '',
    keysBroken: [],
    keysAlreadyThere: [],
    keysPrivateExternal: [],
    keysToImport: [],
  }),
  computed: {
    ...mapGetters('openPGP', ['externalKeys']),
  },
  methods: {
    async check() {
      const keysFromArmor = await checkPgpKeys(
        this.keysArmorToImport,
        this.externalKeys
      )

      this.keysBroken = keysFromArmor.keysBroken
      this.keysAlreadyThere = keysFromArmor.keysAlreadyThere
      this.keysPrivateExternal = keysFromArmor.keysPrivateExternal
      this.keysToImport = keysFromArmor.keysToImport
    },
  },
}
</script>

<style scoped></style>
