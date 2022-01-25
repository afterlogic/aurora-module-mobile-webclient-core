<template>
  <component :is="icon" />
</template>

<script>
import ParanoidIcon from 'components/settings/icons/ParanoidIcon'
import GearIcon from 'components/settings/icons/GearIcon'
import CommonIcon from 'components/settings/icons/CommonIcon'
import PgpIcon from 'components/settings/icons/PgpIcon'
import LogoutIcon from 'components/settings/icons/LogoutIcon'
export default {
  name: 'SettingsMenuIcon',
  components: {
    ParanoidIcon,
    GearIcon,
    CommonIcon,
    PgpIcon,
    LogoutIcon,
  },
  props: {
    icon: { type: String, required: true },
  },
}
</script>

<style scoped></style>
