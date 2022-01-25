<template>
  <q-toolbar class="flex justify-between" style="height: 60px">
    <menu-button url="/mail">
      <mailbox-icon :color="mailIconColor" />
    </menu-button>
    <menu-button url="/contacts">
      <contacts-icon :color="contactsIconColor" />
    </menu-button>
    <menu-button url="/files">
      <files-icon :color="filesIconColor" />
    </menu-button>
    <menu-button url="/settings/menu">
      <settings-icon :color="settingsIconColor" />
    </menu-button>
  </q-toolbar>
</template>

<script>
import MenuButton from 'components/common/MenuButton'
import ContactsIcon from 'components/common/icons/footer/ContactsIcon'
import FilesIcon from 'components/common/icons/footer/FilesIcon'
import MailboxIcon from 'components/common/icons/footer/MailboxIcon'
import SettingsIcon from 'components/common/icons/footer/SettingsIcon'
export default {
  name: 'DefaultFooter',
  components: {
    MenuButton,
    FilesIcon,
    MailboxIcon,
    SettingsIcon,
    ContactsIcon,
  },
  computed: {
    display() {
      return this.$route.fullPath.split('/')[1]
    },
    mailIconColor() {
      return this.display === 'mail' ? '#469CF8' : '#B6B5B5'
    },
    contactsIconColor() {
      return this.display === 'contacts' ? '#469CF8' : '#B6B5B5'
    },
    filesIconColor() {
      return this.display === 'files' ? '#469CF8' : '#B6B5B5'
    },
    settingsIconColor() {
      return this.display === 'settings' ? '#469CF8' : '#B6B5B5'
    },
  },
}
</script>

<style scoped></style>
