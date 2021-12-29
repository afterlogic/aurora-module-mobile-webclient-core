<template>
  <q-footer elevated class="bg-white">
    <component :is="component"></component>
  </q-footer>
</template>

<script>
import FileFooter from "components/files/footer/FileFooter";

export default {
  name: "FooterComponent",
  components: {
    FileFooter
  },
  computed: {
    component() {
      return 'FileFooter'
    }
  }
}
</script>

<style scoped>

</style>
