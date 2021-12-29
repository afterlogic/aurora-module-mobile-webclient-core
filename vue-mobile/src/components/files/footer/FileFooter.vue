<template>
  <component :is="component"/>
</template>

<script>
import DefaultFooter from "components/common/footer/DefaultFooter";
import CopiedFooter from "components/files/footer/CopiedFooter";
import { mapGetters } from "vuex";
export default {
  name: "FileFooter",
  components: {
    DefaultFooter,
    CopiedFooter
  },
  computed: {
    ...mapGetters('files', ['copiedFiles']),
    component() {
      return this.isCopied ?  'CopiedFooter' : 'DefaultFooter'
    },
    isCopied() {
      return !!this.copiedFiles.length
    }
  }
}
</script>

<style scoped>

</style>
