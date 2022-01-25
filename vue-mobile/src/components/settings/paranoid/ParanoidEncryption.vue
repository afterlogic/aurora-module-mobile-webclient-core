<template>
  <div class="q-pa-lg settings flex content-between">
    <div>
      <app-checkbox
        class="settings__checkbox"
        v-model="enableModule"
        left-label
        :label="
          $t('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.LABEL_ENABLE_JSCRYPTO')
        "
      />
      <div class="settings__caption text-secondary q-mt-md">
        <span>
          {{ $t('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.HINT_ABOUT_JSCRYPTO') }}
        </span>
      </div>
      <app-checkbox
        class="settings__checkbox q-mt-md"
        v-model="enableInPersonalStorage"
        left-label
        label="Allow encrypting files in Personal Storage"
      />
      <div class="settings__caption text-secondary q-mt-md">
        <span>
          {{
            $t(
              'COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.HINT_ENCRYPT_IN_PERSONAL_STORAGE'
            )
          }}
        </span>
      </div>
      <div>
        <div v-if="!enableBackwardCompatibility">
          <app-button
            @click="enableBackwardCompatibility = true"
            :label="
              $t(
                'COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.ACTION_ENABLE_BACKWARD_COMPATIBILITY'
              )
            "
            class="q-mt-lg"
          />
        </div>
        <div v-if="enableBackwardCompatibility">
          <app-button
            :label="
              $t('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.ACTION_IMPORT_FILE_KEY')
            "
            class="q-mt-lg"
          />
          <app-button
            :label="
              $t(
                'COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.ACTION_IMPORT_STRING_KEY'
              )
            "
            class="q-mt-md"
          />
          <app-button
            :label="
              $t(
                'COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.ACTION_GENERATE_NEW_KEY'
              )
            "
            class="q-mt-md"
          />
        </div>
      </div>
    </div>
    <div class="full-width">
      <app-button
        class="settings__save-btn"
        @click="save"
        :label="$t('COREWEBCLIENT.ACTION_SAVE')"
      />
    </div>
  </div>
</template>

<script>
import AppCheckbox from 'components/common/AppCheckbox'
import AppButton from 'components/common/AppButton'
import settings from 'src/settings'
import { mapActions } from 'vuex'

export default {
  name: 'ParanoidEncryption',
  components: {
    AppCheckbox,
    AppButton,
  },
  data: () => ({
    enableModule: false,
    enableInPersonalStorage: false,
    enableBackwardCompatibility: false,
  }),
  mounted() {
    const data = settings.getCoreParanoidEncryptionSettings()
    this.enableModule = data.enableModule
    this.enableInPersonalStorage = data.enableInPersonalStorage
  },
  methods: {
    ...mapActions('settings', ['asyncChangeParanoidEncryptionSettings']),
    async save() {
      const parameters = {
        EnableModule: this.enableModule,
        EnableInPersonalStorage: this.enableInPersonalStorage,
      }
      const result = await this.asyncChangeParanoidEncryptionSettings(
        parameters
      )
      if (result) {
        settings.setEncryptFilesPersonalStorage(this.enableInPersonalStorage)
        settings.setEnableParanoidEncryption(this.enableModule)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.settings {
  height: 86vh;
  &__checkbox {
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.3px;
  }
  &__caption {
    font-size: 12px;
    line-height: 14px;
  }
  &__save-btn {
    margin-bottom: 40px;
  }
}
</style>
