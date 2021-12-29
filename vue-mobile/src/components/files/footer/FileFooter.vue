<template>
  <component :is="component"/>
</template>

<script>
import DefaultFooter from "components/common/footer/DefaultFooter";
import CopiedFooter from "components/files/footer/CopiedFooter";
export default {
  name: "FileFooter",
  components: {
    DefaultFooter,
    CopiedFooter
  },
  computed: {
    component() {
      return this.isCopied ?  'CopiedFooter' : 'DefaultFooter'
    },
    isCopied() {
      return !!this.$store.getters['files/getCopiedFiles'].length
    }
  }
}
</script>

<style scoped>

</style>
