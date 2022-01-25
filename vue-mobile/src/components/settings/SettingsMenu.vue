<template>
  <div class="q-mt-lg">
    <settings-menu-item
      :label="$t('COREWEBCLIENT.LABEL_COMMON_SETTINGS_TABNAME')"
      icon="CommonIcon"
      :action="() => $router.push('/settings/paranoid-encryption')"
    />
    <settings-menu-item
      :label="$t('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.LABEL_SETTINGS_TAB')"
      icon="ParanoidIcon"
      :action="() => $router.push('/settings/paranoid-encryption')"
    />
    <settings-menu-item
      :label="$t('COREWEBCLIENT.LABEL_COMMON_SETTINGS_TABNAME')"
      icon="PgpIcon"
      :action="() => $router.push('/settings/paranoid-encryption')"
    />
    <settings-menu-item :action="logout" label="Log out" icon="LogoutIcon" />
  </div>
</template>

<script>
import SettingsMenuItem from 'components/settings/main/SettingsMenuItem'

export default {
  name: 'SettingsMenu',
  components: {
    SettingsMenuItem,
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
  },
}
</script>

<style scoped></style>
