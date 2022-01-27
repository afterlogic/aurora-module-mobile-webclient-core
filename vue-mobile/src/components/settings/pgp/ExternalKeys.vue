<template>
  <div
    style="flex-flow: row wrap; height: 93vh"
    class="flex content-between q-py-lg"
  >
    <div class="q-px-lg">External public keys</div>
    <div style="height: 60vh; overflow-y: auto" class="full-width">
      <div class="keys-list">
        <div class="q-px-lg">
          <key-item v-for="key in externalKeys" :key="key" :label="key.Email" />
          <key-item label="key.Email" />
          <key-item label="key.Email" />
          <key-item label="key.Email" />
          <key-item label="key.Email" />
          <key-item label="key.Email" />
          <key-item label="key.Email" />
          <key-item label="key.Email" />
          <key-item label="key.Email" />
          <key-item label="key.Email" />
        </div>
      </div>
    </div>
    <div class="q-px-lg">
      <app-button
        @click="enableBackwardCompatibility = true"
        :label="$t('OPENPGPWEBCLIENT.ACTION_EXPORT_ALL_PUBLIC_KEYS')"
        class="q-mt-lg"
      />
      <app-button
        @click="enableBackwardCompatibility = true"
        :label="$t('OPENPGPWEBCLIENT.ACTION_IMPORT_KEY')"
        class="q-mt-lg"
      />
      <app-button
        @click="enableBackwardCompatibility = true"
        label="Import keys from file"
        class="q-mt-lg"
      />
    </div>
  </div>
</template>

<script>
import KeyItem from 'components/settings/pgp/KeyItem'
import AppButton from 'components/common/AppButton'
import AppApi from 'src/api'
export default {
  name: 'ExternalKeys',
  components: {
    KeyItem,
    AppButton,
  },
  data: () => ({
    externalKeys: [],
  }),
  mounted() {
    this.getExternalKeys()
  },
  methods: {
    async getExternalKeys() {
      this.externalKeys = await AppApi.openPGP.getExternalKeys()
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
