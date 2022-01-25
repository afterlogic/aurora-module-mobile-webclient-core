<template>
  <div class="q-pa-lg settings flex content-between">
    <div>
      <app-checkbox
        class="settings__checkbox"
        v-model="enableParanoidEncryption"
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
        v-model="allowEncryptingFiles"
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
      <app-button
        :label="
          $t(
            'COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.ACTION_ENABLE_BACKWARD_COMPATIBILITY'
          )
        "
        class="q-mt-lg"
      />
    </div>
    <div class="full-width">
      <app-button
        class="settings__save-btn"
        :label="$t('COREWEBCLIENT.ACTION_SAVE')"
      />
    </div>
  </div>
</template>

<script>
import AppCheckbox from 'components/common/AppCheckbox'
import AppButton from 'components/common/AppButton'

export default {
  name: 'ParanoidEncryption',
  components: {
    AppCheckbox,
    AppButton,
  },
  data: () => ({
    enableParanoidEncryption: false,
    allowEncryptingFiles: false,
  }),
}
</script>

<style lang="scss" scoped>
.settings {
  height: 100vh;
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
    margin-bottom: 180px;
  }
}
</style>
