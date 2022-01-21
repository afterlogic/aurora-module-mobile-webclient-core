<template>
  <q-footer elevated class="bg-white">
    <component :is="component" />
  </q-footer>
</template>

<script>
import CopiedFooter from 'components/files/footer/CopiedFooter'
import DefaultFooter from 'components/common/footer/DefaultFooter'
import { mapGetters } from 'vuex'

export default {
  name: 'FooterComponent',
  components: {
    CopiedFooter,
    DefaultFooter,
  },
  computed: {
    ...mapGetters('files', ['copiedFiles']),
    component() {
      return this.isCopiedFiles ? 'CopiedFooter' : 'DefaultFooter'
    },
    isCopiedFiles() {
      return !!this.copiedFiles.length
    },
  },
}
</script>

<style scoped></style>
