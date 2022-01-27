<template>
  <div
    style="flex-flow: row wrap; height: 93vh"
    class="flex content-between q-py-lg"
  >
    <div class="q-px-lg">External public keys</div>
    <div style="max-height: 50vh; overflow-y: auto" class="full-width">
      <div class="keys-list">
        <div class="q-px-lg">
          <key-item v-for="key in externalKeys" :key="key" :label="key.Email" />
        </div>
      </div>
    </div>
    <div class="q-px-lg full-width">
      <app-button
        @click="enableBackwardCompatibility = true"
        :label="$t('OPENPGPWEBCLIENT.ACTION_EXPORT_ALL_PUBLIC_KEYS')"
        class="q-mt-lg"
      />
      <app-button
        @click="showImportKeys = true"
        :label="$t('OPENPGPWEBCLIENT.ACTION_IMPORT_KEY')"
        class="q-mt-lg"
      />
      <app-button
        @click="enableBackwardCompatibility = true"
        label="Import keys from file"
        class="q-mt-lg"
      />
    </div>
    <import-key-dialog v-model="showImportKeys" />
  </div>
</template>

<script>
import ImportKeyDialog from 'components/settings/pgp/dialogs/ImportKeyDialog'
import KeyItem from 'components/settings/pgp/KeyItem'
import AppButton from 'components/common/AppButton'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ExternalKeys',
  components: {
    ImportKeyDialog,
    KeyItem,
    AppButton,
  },
  data: () => ({
    showImportKeys: false,
  }),
  mounted() {
    this.getExternalKeys()
  },
  computed: {
    ...mapGetters('openPGP', ['externalKeys']),
  },
  methods: {
    ...mapActions('openPGP', ['asyncGetExternalsKeys']),
    async getExternalKeys() {
      await this.asyncGetExternalsKeys()
    },
  },
}
</script>

<style scoped>
.keys-list {
  /*max-height: 325px;*/
  /*height: 55vh;*/
}
</style>
