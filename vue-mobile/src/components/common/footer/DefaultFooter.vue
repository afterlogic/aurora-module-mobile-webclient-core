<template>
  <q-toolbar class="flex justify-between" style="height: 60px">
    <menu-button url="/mail">
      <mail-icon />
    </menu-button>
    <menu-button url="/files">
      <files-icon />
    </menu-button>
    <menu-button url="/settings">
      <settings-icon />
    </menu-button>
  </q-toolbar>
</template>

<script>
import MenuButton from "components/common/MenuButton";
import FilesIcon from "components/common/icons/FilesIcon";
import MailIcon from "components/common/icons/MailIcon";
import SettingsIcon from "components/common/icons/SettingsIcon";

export default {
  name: "DefaultFooter",
  components: {
    MenuButton,
    FilesIcon,
    MailIcon,
    SettingsIcon
  }
}
</script>

<style scoped>

</style>
