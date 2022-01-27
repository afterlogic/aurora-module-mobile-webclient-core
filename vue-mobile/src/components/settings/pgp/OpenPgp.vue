<template>
  <div class="q-pa-lg settings">
    <div>
      <app-checkbox
        class="settings__label"
        left-label
        v-model="storeKey"
        label="Store OpenPGP key password within a session"
      />
      <div class="q-my-md">
        <key-item
          :action="() => $router.push('/settings/open-pgp/external-keys')"
          label="External public keys"
        />
        <key-item
          :action="() => $router.push('/settings/open-pgp/my-keys')"
          label="My keys"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppCheckbox from 'components/common/AppCheckbox'
import KeyItem from 'components/settings/pgp/KeyItem'

export default {
  name: 'OpenPgp',
  components: {
    AppCheckbox,
    KeyItem,
  },
  data: () => ({
    storeKey: false,
  }),
}
</script>

<style lang="scss" scoped>
.settings {
  height: 86vh;
  &__label {
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
