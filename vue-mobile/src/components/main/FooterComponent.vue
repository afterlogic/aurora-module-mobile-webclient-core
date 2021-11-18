<template>
  <q-footer elevated class="bg-white">
    <q-toolbar class="flex justify-between" style="height: 60px">
      <menu-button icon="message" url="/mail"/>
      <menu-button icon="folder" url="/files"/>
      <menu-button icon="settings" url="/settings"/>
    </q-toolbar>
  </q-footer>
</template>

<script>
import MenuButton from "components/common/MenuButton";

export default {
  name: "FooterComponent",
  components: {
    MenuButton
  }
}
</script>

<style scoped>

</style>
